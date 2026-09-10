# claude-code-sandbox README

This is the README for your extension "claude-code-sandbox". After writing up a brief description, we recommend including the following sections.

# Claude Code Sandbox

`claude-code-sandbox` runs Claude Code inside a disposable Docker container while
giving it access to the currently opened VS Code workspace. The project files stay
on the host, but the tools used by Claude Code run in the sandbox environment.

## What the extension does

The extension adds one VS Code command:

**Claude Code Sandbox: Start Claude Code Sandbox**

When the command is executed, the extension:

1. Finds the first workspace folder currently open in VS Code.
2. Builds the Docker image `claude-sandbox-image` from the extension's bundled
	 [`resources/Dockerfile`](resources/Dockerfile).
3. Opens a terminal named **Claude Sandbox**.
4. Starts an interactive, temporary container with the workspace mounted at
	 `/workspace` and `/workspace` as its working directory.
5. Starts `zsh` in that container.

The container is started with `--rm`, so it is removed when the shell exits. The
Docker image remains locally and is rebuilt the next time the command is run.

The image currently contains Ubuntu, Git, `zsh`, `sudo`, Oh My Zsh, and the
Claude Code CLI. The Dockerfile also adds Claude Code's installation directories
to `PATH`.

## Requirements

- Visual Studio Code `1.136.0` or newer.
- Docker Engine or Docker Desktop installed and running.
- Permission to access the Docker daemon from the VS Code environment.
- An internet connection while the image is built. The Dockerfile downloads the
	Ubuntu base image and installs its dependencies, Oh My Zsh, and Claude Code.
- A workspace folder opened in VS Code. The extension uses the first folder when
	multiple workspace folders are open.

On Linux, your user generally needs access to the Docker socket, for example by
being a member of the `docker` group. Follow your Docker installation's
documentation for the appropriate setup.

## How to use it

1. Open the project you want Claude Code to work on in VS Code.
2. Open the Command Palette with `Ctrl+Shift+P` (`Cmd+Shift+P` on macOS).
3. Run **Claude Code Sandbox: Start Claude Code Sandbox**.
4. Wait for Docker to build the image. The first build can take several minutes.
5. Use the **Claude Sandbox** terminal. It opens in `/workspace`, which maps to
	 the host workspace.
6. Run Claude Code from the container as needed.
7. Exit `zsh` when finished. The container is then deleted automatically.

If no workspace is open, the command stops and shows an error instead of starting
the container. If `docker build` fails, the chained `docker run` command is not
executed.

## How the workspace is shared

The extension passes the following Docker volume mapping:

```text
<first VS Code workspace>:/workspace
```

Changes made under `/workspace` are therefore written directly to the host
workspace and persist after the container exits. Packages and other files stored
outside that directory exist only inside the container and are lost when it is
removed.

## Security and limitations

- This is a convenience sandbox, not a hardened security boundary.
- The container is run with access to the Docker daemon through the Docker CLI
	on the host, according to the local Docker setup.
- The workspace is mounted read-write, so commands running in the container can
	change or delete project files.
- The container runs as `root` by default because the Dockerfile does not create
	a non-root user.
- The image uses `ubuntu:latest` and downloads current upstream installers, so
	builds may change over time.
- There are currently no extension settings for changing the image name, mount,
	Docker options, or selected workspace folder.

Do not open untrusted workspaces with this extension unless you understand the
permissions and Docker access available to processes in the container.

## Development

Install dependencies and compile the extension:

```bash
npm install
npm run compile
```

Useful project commands:

```bash
npm run lint
npm test
npm run package
```

## Testing the extension

To test the extension manually:

1. Make sure Docker is installed, running, and accessible from the terminal.
2. Open this repository in VS Code.
3. Run `npm install` in the integrated terminal if the dependencies are not
	installed yet.
4. Press `F5` or `Ctrl+Shift+D` (`Cmd+Shift+D` on macOS) select **Run > Start Debugging**. VS Code opens an Extension
	Development Host window.
5. In the new window, open this repository as a workspace.
6. Open the Command Palette with `F1` or `Ctrl+Shift+P` (`Cmd+Shift+P` on macOS).
7. Run **Claude Code Sandbox: Start Claude Code Sandbox**.
8. Confirm that the **Claude Sandbox** terminal appears, Docker builds the
	image, and an interactive `zsh` prompt opens in `/workspace`.
9. Create or edit a temporary file in `/workspace`, exit `zsh`, and confirm that
	the file remains in the VS Code workspace after the container is removed.
10. Close the Extension Development Host when the test is complete.

For automated project checks, run `npm test`. This compiles the tests and the
extension, runs ESLint, and executes the VS Code test suite.

## Release notes

### 0.0.1

Initial release with a command for building and starting the Claude Code Docker
sandbox.
