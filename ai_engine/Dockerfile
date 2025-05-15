FROM ollama/ollama:latest

# Install any needed tools
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Preload the Mistral model using a subshell
RUN bash -c "ollama serve & \
    until curl -s http://localhost:11434 > /dev/null; do sleep 1; done && \
    ollama pull mistral"

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
