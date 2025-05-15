# collector/app.py

import time
import json
import requests

OLLAMA_API = "http://neurodevops-ai:11434/api/generate"
DASHBOARD_API = "http://dashboard:8080/update"

def get_system_metrics():
    return """\
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
        res = requests.post(OLLAMA_API, json=payload)
        res.raise_for_status()
        result = res.json()
        print("[OLLAMA RESPONSE]", json.dumps(result, indent=2))
        return result.get("response", "[No 'response' in Ollama reply]")
    except Exception as e:
        print("[OLLAMA ERROR]", e)
        return "[AI response unavailable]"

def post_to_dashboard(metrics, ai_response):
    try:
        res = requests.post(DASHBOARD_API, data={
            "metrics": metrics,
            "ai_response": ai_response
        })
        res.raise_for_status()
    except Exception as e:
        print("[DASHBOARD ERROR]", e)

if __name__ == "__main__":
    while True:
        metrics = get_system_metrics()
        ai_reply = send_to_ai(metrics)
        post_to_dashboard(metrics, ai_reply)
        time.sleep(60)
