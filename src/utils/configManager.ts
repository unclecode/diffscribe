// src/utils/configManager.ts

import * as vscode from 'vscode';

export class ConfigManager {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public async clearAllSettings(): Promise<void> {
        const config = vscode.workspace.getConfiguration('diffscribe');
        const keys = Object.keys(config);
        
        for (const key of keys) {
            await config.update(key, undefined, vscode.ConfigurationTarget.Global);
        }

        // Clear global state
        for (const key of this.context.globalState.keys()) {
            await this.context.globalState.update(key, undefined);
        }

        console.log('All DiffScribe settings and global state cleared.');
    }

    public isDebugMode(): boolean {
        // return process.env.VSCODE_DEBUG_MODE === 'true';
        return false;
    }

    public getConfig<T>(key: string): T | undefined {
        const config = vscode.workspace.getConfiguration('diffscribe');
        let value = config.get<T>(key);

        // If the value is not set in VS Code settings, check environment variables
        if (value === undefined || value === '') {
            const envVarName = `${key.toUpperCase()}`;
            const envValue = process.env[envVarName];
            if (envValue) {
                value = envValue as unknown as T;
                // Save the environment variable value to VS Code settings
                this.setConfig(key, value);
            }
        }

        return value;
    }

    public async setConfig<T>(key: string, value: T): Promise<void> {
        const config = vscode.workspace.getConfiguration('diffscribe');
        try {
            await config.update(key, value, vscode.ConfigurationTarget.Global);
        } catch (error) {
            console.error(`Error setting configuration for key ${key}:`, error);
            throw new Error(`Failed to update configuration for ${key}`);
        }
    }

    public getAllConfig(): Record<string, unknown> {
        const config = vscode.workspace.getConfiguration('diffscribe');
        return Object.keys(config).reduce((acc, key) => {
            acc[key] = this.getConfig(key);
            return acc;
        }, {} as Record<string, unknown>);
    }

    public getGlobalState<T>(key: string): T | undefined {
        return this.context.globalState.get<T>(key);
    }

    public setGlobalState<T>(key: string, value: T): Thenable<void> {
        return this.context.globalState.update(key, value);
    }
}