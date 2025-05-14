# collector/app.py

import time
import json
import requests

OLLAMA_API = "http://ai_engine:11434/api/generate"  # Docker service name
DASHBOARD_API = "http://dashboard:8080/api/ingest"  # POST endpoint to send data

def get_system_metrics():
    return """
[CPU] usage: 78%
[Memory] usage: 65%
[Network] eth0 packet loss: 4%
[Disk] /var is 91% full
"""

def send_to_ai(prompt):
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }
    try:
        response = requests.post(OLLAMA_API, json=payload)
        return response.json().get("response")
    except Exception as e:
        print("[Ollama Error]", e)
        return "[AI response unavailable]"

def send_to_ai(prompt):
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }
    try:
        response = requests.post(OLLAMA_API, json=payload)
        response.raise_for_status()
        result = response.json()
        print("OLLAMA RAW:", json.dumps(result, indent=2))
        return result.get("response", "[No response field in result]")
    except Exception as e:
        print("OLLAMA ERROR:", e)
        return "[AI response unavailable]"
