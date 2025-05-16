import os
import time
import psutil
import redis
import json

REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
CHANNEL     = 'telemetry:latest'

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

def gather_metrics():
    return {
        'timestamp': time.time(),
        'cpu_percent': psutil.cpu_percent(interval=1),
        'mem_percent': psutil.virtual_memory().percent,
        'disk_percent': psutil.disk_usage('/').percent,
        'net_io': psutil.net_io_counters()._asdict(),
    }

def main(publish_interval=5):
    while True:
        metrics = gather_metrics()
        r.publish(CHANNEL, json.dumps(metrics))
        time.sleep(publish_interval)

if __name__ == '__main__':
    main()
