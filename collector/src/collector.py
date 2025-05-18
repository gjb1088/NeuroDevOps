# collector/src/collector.py
import os
import time
import psutil
import redis
import json

REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
CHANNEL     = 'telemetry:latest'
# now read the publish interval from env
PUBLISH_INTERVAL = int(os.getenv('PUBLISH_INTERVAL', 5))

print(f"[collector] → starting, will publish every {PUBLISH_INTERVAL}s to {REDIS_HOST}:{REDIS_PORT} channel={CHANNEL}")
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_connect_timeout=5)

def gather_metrics():
    return {
        'timestamp': time.time(),
        'cpu_percent': psutil.cpu_percent(interval=1),
        'mem_percent': psutil.virtual_memory().percent,
        'disk_percent': psutil.disk_usage('/').percent,
        'net_io': psutil.net_io_counters()._asdict(),
    }

def main():
    while True:
        m = gather_metrics()
        payload = json.dumps(m)
        try:
            r.publish(CHANNEL, payload)
            print(f"[collector] → published: {payload}")
        except Exception as e:
            print(f"[collector][ERROR] could not publish to Redis:", e)
        time.sleep(PUBLISH_INTERVAL)

if __name__ == '__main__':
    main()
