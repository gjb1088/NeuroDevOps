#!/bin/sh

# Wait until the Ollama server is ready
until curl -s http://localhost:11434 > /dev/null; do
  echo "Waiting for Ollama to start..."
  sleep 2
done

# Pull the model
ollama pull mistral

# Start Ollama
exec ollama serve
