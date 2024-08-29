Certainly! I'll list down the functions or classes for each file, and then suggest an order of implementation.

1. src/utils/gitCommands.ts:
   - `runGitCommand(command: string): Promise<string>`
   - `getGitDiff(diffCommand: string): Promise<string>`

2. src/utils/configManager.ts:
   - `class ConfigManager`
     - `getConfig(key: string): any`
     - `setConfig(key: string, value: any): Promise<void>`
     - `getAllConfig(): Record<string, any>`

3. src/providers/claude.ts:
   - `generateMessageWithClaude(apiKey: string, gitDiff: string): Promise<string>`

4. src/providers/groq.ts:
   - `generateMessageWithGroq(apiKey: string, gitDiff: string): Promise<string>`

5. src/views/settingsView.ts:
   - `class SettingsWebviewProvider`
     - `resolveWebviewView(webviewView: vscode.WebviewView): void`
     - `getHtmlForWebview(webview: vscode.Webview): string`

6. src/commands/setApiKeys.ts:
   - `setApiKeysCommand(): Promise<void>`

7. src/commands/generateMessage.ts:
   - `generateMessage(diffCommand: string): Promise<void>`
   - `chooseTimeAndGenerateMessage(): Promise<void>`

8. src/commands/showSettings.ts:
   - `showSettingsCommand(): Promise<void>`

9. src/extension.ts:
   - `activate(context: vscode.ExtensionContext): void`
   - `deactivate(): void`

Suggested order of implementation:

1. utils/gitCommands.ts
2. utils/configManager.ts
3. providers/claude.ts
4. providers/groq.ts
5. views/settingsView.ts
6. commands/setApiKeys.ts
7. commands/generateMessage.ts
8. commands/showSettings.ts
9. extension.ts

This order allows you to build from the smallest, most fundamental parts (utilities) up to the main extension file. You'll implement the core functionalities first, then the provider-specific code, followed by the UI components, and finally tie everything together in the main extension file.

Remember to update the package.json file to reflect any new commands or configuration options you add during this refactoring process.