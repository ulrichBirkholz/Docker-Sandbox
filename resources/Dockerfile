# resources/Dockerfile
FROM ubuntu:latest

# Install dependencies
RUN apt-get update && apt-get install -y curl git zsh sudo && rm -rf /var/lib/apt/lists/*

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Install Claude Code CLI and add it to the PATH
RUN curl -fsSL https://claude.ai/install.sh | bash
ENV PATH="/root/.local/bin:/root/.claude/bin:${PATH}"

WORKDIR /workspace
CMD ["zsh"]