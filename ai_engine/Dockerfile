FROM ollama/ollama:latest

# Pre-install curl and pull mistral model
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* \
 && ollama serve & \
 && sleep 3 && curl -s http://localhost:11434 > /dev/null \
 && ollama pull mistral

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
