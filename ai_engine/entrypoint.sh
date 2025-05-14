#!/bin/sh

# Start Ollama in the background
ollama serve &

# Wait for Ollama to be ready
until curl -s http://localhost:11434 > /dev/null; do
  echo "Waiting for Ollama to start..."
  sleep 2
done

# Pull the model once Ollama is ready
ollama pull mistral

# Keep Ollama running in the foreground
fg %1
