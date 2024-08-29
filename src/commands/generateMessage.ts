// src/commands/generateMessage.ts

import * as vscode from 'vscode';
import { ConfigManager } from '../utils/configManager';
import { ClaudeProvider } from '../providers/claude';
import { GroqProvider } from '../providers/groq';
import * as gitCommands from '../utils/gitCommands';

export class GenerateMessageCommand {
    private claudeProvider: ClaudeProvider;
    private groqProvider: GroqProvider;

    constructor(private configManager: ConfigManager) {
        this.claudeProvider = new ClaudeProvider(configManager);
        this.groqProvider = new GroqProvider(configManager);
    }

    async execute(diffCommand: string): Promise<void> {
        try {
            // Check if git is installed
            try {
                await gitCommands.executeGitCommand('git --version');
            } catch (error) {
                throw new Error('Git is not installed or not in the system PATH.');
            }

            // Check if we're in a git repository
            try {
                await gitCommands.executeGitCommand('git rev-parse --is-inside-work-tree');
            } catch (error) {
                throw new Error('This command must be run from within a Git repository.');
            }

            // Get the git diff
            const gitDiff = await gitCommands.executeGitCommand(diffCommand);

            if (!gitDiff.trim()) {
                vscode.window.showWarningMessage('No changes found for the specified range.');
                return;
            }

            // Get the selected LLM provider
            const llmProvider = this.configManager.getConfig<string>('llmProvider') || 'ANTHROPIC';

            // Generate the commit message
            const result = await this.generateCommitMessage(llmProvider, gitDiff);

            if (result.status === 'error') {
                vscode.window.showErrorMessage(`Error generating commit message: ${result.message}`);
                return;
            }

            const commitMessage = result.response;

            if (!commitMessage) {
                throw new Error('No commit message generated');
            }

            // Display the commit message and options
            const userResponse = await vscode.window.showInformationMessage(
                commitMessage,
                { modal: true },
                'Copy to Clipboard',
                'Commit with this message',
                'Edit message'
            );

            switch (userResponse) {
                case 'Copy to Clipboard':
                    await vscode.env.clipboard.writeText(commitMessage);
                    vscode.window.showInformationMessage('Commit message copied to clipboard!');
                    break;
                case 'Commit with this message':
                    await gitCommands.commitChanges(commitMessage);
                    vscode.window.showInformationMessage('Changes committed successfully!');
                    break;
                case 'Edit message':
                    const editedMessage = await vscode.window.showInputBox({
                        prompt: 'Edit the commit message',
                        value: commitMessage
                    });
                    if (editedMessage) {
                        await gitCommands.commitChanges(editedMessage);
                        vscode.window.showInformationMessage('Changes committed with edited message!');
                    }
                    break;
            }

        } catch (error) {
            vscode.window.showErrorMessage('Error: ' + (error instanceof Error ? error.message : String(error)));
        }
    }

    private async generateCommitMessage(provider: string, gitDiff: string): Promise<{ status: string, message: string, response?: string }> {
        switch (provider) {
            case 'ANTHROPIC':
                return this.claudeProvider.generateMessage(gitDiff);
            case 'GROQ':
                return this.groqProvider.generateMessage(gitDiff);
            default:
                return { status: 'error', message: `Unsupported LLM provider: ${provider}` };
        }
    }

    async executeCustomTimeRange(): Promise<void> {
        const timeOptions = [
            { label: 'Last hour', value: '1.hour.ago' },
            { label: 'Last 6 hours', value: '6.hours.ago' },
            { label: 'Last 12 hours', value: '12.hours.ago' },
            { label: 'Last day', value: '1.day.ago' },
            { label: 'Last week', value: '1.week.ago' },
            { label: 'Custom', value: 'custom' }
        ];

        const selected = await vscode.window.showQuickPick(timeOptions, {
            placeHolder: 'Select time range for diff'
        });

        if (!selected) {
            return; // User canceled the selection
        }

        let timeValue = selected.value;

        if (timeValue === 'custom') {
            const customTime = await vscode.window.showInputBox({
                prompt: 'Enter custom time range (e.g., 2.days.ago, 1.month.ago)',
                placeHolder: '2.days.ago'
            });

            if (!customTime) {
                return; // User canceled the input
            }

            timeValue = customTime;
        }

        await this.execute(`git diff HEAD@{${timeValue}}`);
    }
}