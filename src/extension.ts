// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, the extension "claude-code-sandbox" is now active!');

    let disposable = vscode.commands.registerCommand('claude-code-sandbox.start', () => {
        
        // 1. Workspace-Pfad ermitteln
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Bitte öffne zuerst einen Workspace.");
            return;
        }
        const workspacePath = workspaceFolders.uri.fsPath;

        // 2. Absoluten Pfad zum Dockerfile im Plugin-Verzeichnis ermitteln
        const dockerfilePath = path.join(context.extensionPath, 'resources');

        // 3. Terminal erstellen
        const terminal = vscode.window.createTerminal("Claude Sandbox");
        terminal.show();

        // 4. Docker-Image bauen (nutzt das Dockerfile aus dem Plugin) und Container starten
        // Das Image nennen wir 'claude-sandbox-image'
        const buildCmd = `docker build -t claude-sandbox-image "${dockerfilePath}"`;
        
        // Container starten: -v für Shared Volume, -it für interaktiv
        const runCmd = `docker run -it --rm -v "${workspacePath}:/workspace" -w /workspace claude-sandbox-image zsh`;

        // Befehle ans Terminal senden
        terminal.sendText(buildCmd);
        terminal.sendText(runCmd);

		vscode.window.showInformationMessage('Sandbox is ready!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
