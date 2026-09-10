// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, the extension "claude-code-sandbox" is now active!');

    let disposable = vscode.commands.registerCommand('claude-code-sandbox.start', () => {
        
        // 1. get workspace-path
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Bitte öffne zuerst einen Workspace.");
            return;
        }
        const workspacePath = workspaceFolders[0].uri.fsPath;

        // 2. get absolute path to Dockerfile in Plugin-Folder
        const dockerfilePath = path.join(context.extensionPath, 'resources');

        // 3. setup terminal
        const terminal = vscode.window.createTerminal("Claude Sandbox");
        terminal.show();

        // 4. concatenate commands with: 
        // 'docker run' startet ERST, if 'docker build' terminates successfully with status 0.
        const combinedCmd = `docker build -t claude-sandbox-image "${dockerfilePath}" && docker run -it --rm -v "${workspacePath}:/workspace" -w /workspace claude-sandbox-image zsh`;
        terminal.sendText(combinedCmd);

        vscode.window.showInformationMessage('Claude Sandbox wird gestartet...');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
