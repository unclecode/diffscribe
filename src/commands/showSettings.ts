import * as vscode from 'vscode';
import { SettingsWebviewProvider } from '../views/settingsView';
import { ConfigManager } from '../utils/configManager';

export class ShowSettingsCommand {
    private settingsViewProvider: SettingsWebviewProvider;

    constructor(
        private context: vscode.ExtensionContext,
        private configManager: ConfigManager
    ) {
        this.settingsViewProvider = new SettingsWebviewProvider(context.extensionUri, configManager);
    }

    async execute(): Promise<void> {
        try {
            // Register the webview provider if it hasn't been registered yet
            if (!this.context.subscriptions.some(d => d === this.settingsViewProvider)) {
                this.context.subscriptions.push(
                    vscode.window.registerWebviewViewProvider(
                        SettingsWebviewProvider.viewType,
                        this.settingsViewProvider
                    )
                );
                this.context.subscriptions.push(this.settingsViewProvider);
            }

            // Show the webview
            await vscode.commands.executeCommand('workbench.view.extension.diffscribe-settings-view');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to open settings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}