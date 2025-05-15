#!/bin/sh

# Start Ollama in the background
ollama serve &

# Wait for Ollama to be ready
until curl -s http://localhost:11434 > /dev/null; do
  echo "Waiting for Ollama to start..."
  sleep 2
done

# Pull the model
ollama pull mistral

# Now run Ollama in the foreground properly
exec ollama serve
