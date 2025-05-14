# ai_engine/Dockerfile

FROM ollama/ollama:latest

# Preload the Mistral model at build time
RUN ollama pull mistral

# Run the Ollama API server
CMD ["ollama", "serve"]
