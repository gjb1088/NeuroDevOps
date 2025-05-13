# app.py
import requests
import json

OLLAMA_API = "http://host.docker.internal:11434/api/generate"

def load_prompt():
    # Example static prompt – eventually swap with input from `collector/`
    return """
[LOG] eth0 interface showing packet loss
[LOG] DNS latency exceeds 200ms
Suggest system-level remediations.
"""

def run_inference(prompt):
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_API, json=payload)
    return response.json().get("response")

if __name__ == "__main__":
    prompt = load_prompt()
    result = run_inference(prompt)
    print("Mistral Response:\n", result)
