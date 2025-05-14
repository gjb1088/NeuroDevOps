# app.py
import requests
import json
import os

OLLAMA_API = "http://host.docker.internal:11434/api/generate"

def load_prompt():
    return """
[LOG] eth0 interface showing packet loss
[LOG] DNS latency exceeds 200ms
Suggest system-level remediations.
"""

def load_config():
    default_config = {
        "model": "mistral",
        "temperature": 0.7,
        "max_tokens": 1024,
        "top_p": 0.9,
        "stream": False
    }

    config_path = "model_config.json"
    if os.path.exists(config_path):
        with open(config_path) as f:
            user_config = json.load(f)
            default_config.update(user_config)
    return default_config

def run_inference(prompt, config):
    payload = {
        "model": config["model"],
        "prompt": prompt,
        "temperature": config["temperature"],
        "max_tokens": config["max_tokens"],
        "top_p": config["top_p"],
        "stream": config["stream"]
    }
    response = requests.post(OLLAMA_API, json=payload)
    return response.json().get("response")

if __name__ == "__main__":
    prompt = load_prompt()
    config = load_config()
    result = run_inference(prompt, config)
    print("Mistral Response:\n", result)
