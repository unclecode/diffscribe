// src/commands/setApiKeys.ts

import * as vscode from 'vscode';
import { ConfigManager } from '../utils/configManager';

export class SetApiKeysCommand {
    constructor(private configManager: ConfigManager) {}

    async execute(): Promise<void> {
        const providers = ['ANTHROPIC', 'GROQ'];
        const currentProvider = this.configManager.getConfig<string>('llmProvider') || 'ANTHROPIC';

        for (const provider of providers) {
            const providerKey = `${provider}ApiKey`;
            const currentKey = this.configManager.getConfig<string>(providerKey) || '';
            const newKey = await vscode.window.showInputBox({
                prompt: `Enter API key for ${provider} (leave empty to keep current)`,
                password: true,
                value: currentKey
            });

            if (newKey !== undefined) {
                await this.configManager.setConfig(`${provider}ApiKey`, newKey);
            }
        }

        const newProvider = await vscode.window.showQuickPick(providers, {
            placeHolder: 'Select default LLM provider',
        });

        if (newProvider) {
            await this.configManager.setConfig('llmProvider', newProvider);
        }

        vscode.window.showInformationMessage('API keys and provider settings updated successfully!');
    }
}