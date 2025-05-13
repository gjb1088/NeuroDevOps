import time
import json
import requests

OLLAMA_API = "http://ai_engine:11434/api/generate"  # Use service name from docker-compose

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
    response = requests.post(OLLAMA_API, json=payload)
    return response.json().get("response")

if __name__ == "__main__":
    while True:
        metrics = get_system_metrics()
        ai_feedback = send_to_ai(metrics)
        print("\n[AI RECOMMENDATION]\n", ai_feedback)
        time.sleep(60)
