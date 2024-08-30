import * as vscode from 'vscode';
import * as cp from 'child_process';

/**
 * Executes a Git command in the current workspace.
 * @param command The Git command to execute.
 * @returns A promise that resolves with the command output or rejects with an error.
 */
export async function executeGitCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const workspacePath = vscode.workspace.rootPath;

        if (!workspacePath) {
            reject(new Error('No workspace is currently open.'));
            return;
        }

        cp.exec(command, { cwd: workspacePath }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Git command failed: ${command}\n${stderr}`));
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

/**
 * Gets the Git diff for staged changes.
 * @returns A promise that resolves with the diff output or rejects with an error.
 */
export async function getStagedDiff(): Promise<string> {
    return executeGitCommand('git diff --staged');
}

/**
 * Gets the Git diff since the last push.
 * @returns A promise that resolves with the diff output or rejects with an error.
 */
export async function getDiffSinceLastPush(): Promise<string> {
    return executeGitCommand('git diff @{push}');
}

/**
 * Gets the Git diff for a custom time range.
 * @param timeRange The time range to use for the diff (e.g., '1.hour.ago', '2.days.ago').
 * @returns A promise that resolves with the diff output or rejects with an error.
 */
export async function getDiffForTimeRange(timeRange: string): Promise<string> {
    return executeGitCommand(`git diff HEAD@{${timeRange}}`);
}

/**
 * Commits changes with the given message.
 * @param message The commit message.
 * @returns A promise that resolves when the commit is successful or rejects with an error.
 */
export async function commitChanges(message: string): Promise<void> {
    // Escape single quotes and wrap the entire message in single quotes
    const escapedMessage = message.replace(/'/g, "'\\''");
    await executeGitCommand(`git commit -m '${escapedMessage}'`);
}