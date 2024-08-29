// src/views/settingsView.ts

import * as vscode from 'vscode';
import { ConfigManager } from '../utils/configManager';

export class SettingsWebviewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
    public static readonly viewType = 'diffscribe.settingsView';
    private _view?: vscode.WebviewView;
    private _disposables: vscode.Disposable[] = [];

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _configManager: ConfigManager
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        this._setWebviewMessageListener(webviewView.webview);
    }

    public dispose() {
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'settingsView.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'settingsView.css'));
        const codiconsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));

        const nonce = this._getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
    <link href="${styleUri}" rel="stylesheet">
    <link href="${codiconsUri}" rel="stylesheet">
    <title>DiffScribe Settings</title>
</head>
<body class="vscode-body">
    <section class="section">
        <h2 class="section-title">Provider Settings</h2>
        <div class="section-content">
            <div class="form-group">
                <label for="provider-select" class="label">Select Provider:</label>
                <select id="provider-select" class="select-input">
                    <option value="ANTHROPIC">Claude (Anthropic)</option>
                    <option value="GROQ">Groq</option>
                </select>
            </div>
            <div class="form-group">
                <label for="api-key" class="label">API Key:</label>
                <input type="password" id="api-key" class="text-input" />
            </div>
            <button id="save-api-key" class="button">
                <span class="codicon codicon-save"></span>
                Save API Key
            </button>
        </div>
    </section>
    <section class="section">
        <h2 class="section-title">Extension Settings</h2>
        <p class="section-content">No custom settings available at the moment.</p>
    </section>
    <section class="section">
        <h2 class="section-title">Git Command Settings</h2>
        <p class="section-content">No custom settings available at the moment.</p>
    </section>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
    }

    private _getSettings() {
        return {
            ANTHROPIC_API_KEY: this._configManager.getConfig('ANTHROPIC_API_KEY'),
            GROQ_API_KEY: this._configManager.getConfig('GROQ_API_KEY'),
            llmProvider: this._configManager.getConfig('llmProvider')
        };
    }

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            async (message: any) => {
                switch (message.command) {
                    case 'getSettings':
                        const settings =  this._getSettings();
                        webview.postMessage({ command: 'setSettings', settings });
                        break;
                    case 'saveSettings':
                        try {
                            await this._configManager.setConfig('llmProvider', message.provider);
                            vscode.window.showInformationMessage('Settings saved successfully!');
                            webview.postMessage({ command: 'settingsSaved'});
                        } catch (error) {
                            vscode.window.showErrorMessage(`Failed to save settings: ${error instanceof Error ? error.message : String(error)}`);
                        }
                        break;
                    case 'saveApiKey':
                        try {
                            await this._configManager.setConfig(`${message.provider}_API_KEY`, message.apiKey);
                            vscode.window.showInformationMessage(`API key for ${message.provider} saved successfully!`);
                            webview.postMessage({ command: 'apiKeySaved', provider: message.provider });
                        } catch (error) {
                            vscode.window.showErrorMessage(`Failed to save API key: ${error instanceof Error ? error.message : String(error)}`);
                        }
                        break;
                }
            },
            undefined,
            this._disposables
        );
    }


    private _getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}