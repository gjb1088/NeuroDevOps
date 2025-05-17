# collector.py

import os
import time
import json

import ping3
import psutil
import redis

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
CHANNEL    = "telemetry:latest"
TARGET_IP  = os.getenv("PING_TARGET", "8.8.8.8")
PUBLISH_INTERVAL = int(os.getenv("PUBLISH_INTERVAL", 5))

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

def gather_network_metrics():
    # 1) measure latency (ms)
    latency = ping3.ping(TARGET_IP, unit="ms")
    latency_ms = round(latency or 0.0, 1)

    # 2) quick packet-loss estimate: 5 probes
    probes = 5
    failures = 0
    for _ in range(probes):
        if ping3.ping(TARGET_IP, unit="ms") is None:
            failures += 1
    packet_loss_pct = round((failures / probes) * 100, 1)

    # 3) throughput: measure bytes over one second
    counters_before = psutil.net_io_counters()
    time.sleep(1)
    counters_after  = psutil.net_io_counters()
    delta_bytes     = (
        (counters_after.bytes_sent + counters_after.bytes_recv)
        - (counters_before.bytes_sent + counters_before.bytes_recv)
    )
    throughput_mbps = round((delta_bytes * 8) / (1024 * 1024), 1)

    return {
        "timestamp":          int(time.time() * 1000),
        "latency_ms":         latency_ms,
        "packet_loss_pct":    packet_loss_pct,
        "throughput_mbps":    throughput_mbps,
    }

def main():
    while True:
        metrics = gather_network_metrics()
        r.publish(CHANNEL, json.dumps(metrics))
        time.sleep(PUBLISH_INTERVAL)

if __name__ == "__main__":
    main()
