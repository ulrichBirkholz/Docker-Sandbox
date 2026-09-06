# resources/Dockerfile
FROM ubuntu:latest

RUN apt-get update && apt-get install -y curl git zsh sudo && rm -rf /var/lib/apt/lists/*
RUN sh -c "\$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN curl -fsSL https://claude.ai/install.sh | bash

WORKDIR /workspace
CMD ["zsh"]