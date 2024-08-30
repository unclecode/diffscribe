![DiffScribe Banner](assets/banner.jpeg)

# 🧠 DiffScribe: AI-Powered Commit Messages For All Seasons

We've all been there. Staring at the screen, fingers hovering over the keyboard, trying to come up with the perfect commit message. Minutes tick by, and the pressure mounts. Sound familiar? 

Say goodbye to commit message writer's block! 👋

DiffScribe is here to rescue you from the commit message abyss. This intelligent VS Code extension analyzes your changes and crafts meaningful, descriptive commit messages in seconds. Powered by your choice of Claude AI or Groq, DiffScribe brings expert-level Git practices to every developer, saving you time and mental energy.

## ✨ Key Features

- 🚀 **Instant Generation**: Create informative commit messages with a single command
- 🤖 **Dual AI Power**: Choose between Claude AI (Anthropic) or Groq for message generation
- ⏳ **Time-Saving**: Streamlines the commit process, especially for complex changes
- 📊 **Consistency**: Maintains a clean, professional Git history
- 📋 **Clipboard Integration**: Automatically copies generated messages for quick use
- 🕰️ **Flexible Time Ranges**: Generate messages for custom time periods or since last push
- 💾 **Commit Integration**: Option to commit changes directly with the generated message

## 🎯 Perfect for:

- 🌱 Beginners learning Git best practices
- 👨‍💻 Seasoned pros streamlining their workflow
- 👥 Teams aiming for consistent, meaningful commit histories

## 🚀 Getting Started

1. Install the DiffScribe extension in VS Code
2. Set up your Anthropic (Claude AI) or Groq API key
3. Choose your preferred AI provider in the settings
4. Start generating awesome commit messages!

## 💡 How to Use DiffScribe

DiffScribe offers several commands to help you generate commit messages and manage your git workflow. Here's how to use them:

1. **Generate Commit Message (Staged Changes)**
   - Command: `diffscribe.generateCommitMessage`
   - Shortcut: `Ctrl+Alt+G` (Windows/Linux) or `Cmd+Option+G` (Mac)
   - Description: Generates a commit message based on your currently staged changes.

2. **Generate Commit Message (Since Last Push)**
   - Command: `diffscribe.generateCommitMessageSinceLastPush`
   - Description: Creates a commit message that summarizes all changes since your last push.

3. **Generate Commit Message (Custom Time Range)**
   - Command: `diffscribe.generateCommitMessageCustomTime`
   - Description: Allows you to specify a custom time range and generates a commit message for changes within that period.

4. **Set API Keys**
   - Command: `diffscribe.setApiKeys`
   - Description: Opens a prompt to set or update your API keys for the AI providers.

5. **Show Settings**
   - Command: `diffscribe.showSettings`
   - Description: Opens the DiffScribe settings panel where you can configure the extension.

To use these commands:
1. Open the Command Palette in VS Code (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
2. Type "DiffScribe" to see all available commands
3. Select the command you want to use

Alternatively, you can use the provided shortcut for generating commit messages from staged changes.

After generating a message, DiffScribe will present options to:
- Copy the message to your clipboard
- Commit changes with the generated message
- Edit the message before committing

## 🔑 API Key Setup

DiffScribe requires an API key for either Anthropic (Claude AI) or Groq. Set these as environment variables or in the extension settings.

## 🎉 Upgrade Your Commits Today!

Stop wasting time crafting the perfect commit message. Let DiffScribe be your AI pair programmer, turning your code changes into clear, concise, and meaningful commit messages in seconds. 

Say hello to a more efficient, descriptive version control process. Let DiffScribe handle the commit messages while you focus on what really matters – writing great code!

Happy coding! 🚀✨