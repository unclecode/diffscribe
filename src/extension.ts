// src/extension.ts

import * as vscode from 'vscode';
import { ConfigManager } from './utils/configManager';
import { SetApiKeysCommand } from './commands/setApiKeys';
import { GenerateMessageCommand } from './commands/generateMessage';
import { SettingsWebviewProvider } from './views/settingsView';

export async function activate(context: vscode.ExtensionContext) {
    console.log('DiffScribe is now active!');



    // Initialize ConfigManager
    const configManager = new ConfigManager(context);

    if (configManager.isDebugMode()) {
        await configManager.clearAllSettings();
        console.log('Debug mode detected. All DiffScribe settings cleared.');
    }

    // Initialize commands
    const setApiKeysCommand = new SetApiKeysCommand(configManager);
    const generateMessageCommand = new GenerateMessageCommand(configManager);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('diffscribe.setApiKeys', () => setApiKeysCommand.execute()),
        vscode.commands.registerCommand('diffscribe.generateCommitMessage', () => generateMessageCommand.execute('git diff --staged')),
        vscode.commands.registerCommand('diffscribe.generateCommitMessageSinceLastPush', () => generateMessageCommand.execute('git diff @{push}')),
        vscode.commands.registerCommand('diffscribe.generateCommitMessageCustomTime', () => generateMessageCommand.executeCustomTimeRange())
    );

    // Register SettingsWebviewProvider
    const settingsProvider = new SettingsWebviewProvider(context.extensionUri, configManager);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(SettingsWebviewProvider.viewType, settingsProvider)
    );

    // Check for API keys on activation
    checkApiKeys(configManager);
}

function checkApiKeys(configManager: ConfigManager) {
    const providers = ['ANTHROPIC', 'GROQ'];
    let missingKeys = [];

    for (const provider of providers) {
        const apiKey = configManager.getConfig<string>(`${provider.toUpperCase()}_API_KEY`);
        if (!apiKey) {
            missingKeys.push(provider);
        }
    }

    if (missingKeys.length > 0) {
        vscode.window.showWarningMessage(
            `API key(s) missing for: ${missingKeys.join(', ')}. Please set them in the settings.`,
            'Open Settings'
        ).then(selection => {
            if (selection === 'Open Settings') {
                vscode.commands.executeCommand('diffscribe.showSettings');
            }
        });
    }
}

export function deactivate() {
    // Clean up resources if needed
}