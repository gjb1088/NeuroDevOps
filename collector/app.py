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

def send_to_dashboard(metrics, ai_response):
    try:
        response = requests.post(DASHBOARD_API, json={
            "metrics": metrics,
            "ai": ai_response
        })
        if response.status_code != 200:
            print("[Dashboard Error] Status:", response.status_code, response.text)
    except Exception as e:
        print("[Dashboard Error]", e)

if __name__ == "__main__":
    while True:
        metrics = get_system_metrics()
        ai_feedback = send_to_ai(metrics)
        print("\n[AI RECOMMENDATION]\n", ai_feedback)
        send_to_dashboard(metrics, ai_feedback)
        time.sleep(60)
