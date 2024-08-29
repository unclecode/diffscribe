// media/settingsView.js

(function() {
    const vscode = acquireVsCodeApi();

    document.getElementById('provider-select').addEventListener('change', (event) => {
        const provider = event.target.value;
        vscode.postMessage({ command: 'saveSettings', provider  });
    });

    document.getElementById('save-api-key').addEventListener('click', () => {
        const provider = document.getElementById('provider-select').value;
        const apiKey = document.getElementById('api-key').value;
        vscode.postMessage({ command: 'saveApiKey', provider, apiKey });
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.command) {
            case 'setSettings':
                const settings = message.settings;
                document.getElementById('provider-select').value = settings.llmProvider || 'ANTHROPIC';
                document.getElementById('api-key').value = settings[`${document.getElementById('provider-select').value}_API_KEY`] || '';
                break;
            case 'apiKeySaved':
                document.getElementById('api-key').value = '';
                break;
            case 'settingsSaved':
                vscode.postMessage({ command: 'getSettings' });
                break;
            case 'settingsError':
                vscode.postMessage({ command: 'getSettings' });
                break;
        }
    });

    // Initial load of settings
    vscode.postMessage({ command: 'getSettings' });
})();