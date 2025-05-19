# collector/src/collector.py
import os
import time
import json
import psutil
import redis
import ping3  # make sure ping3 is in requirements.txt

# ── CONFIG ────────────────────────────────────────────────────────────────
REDIS_HOST       = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT       = int(os.getenv("REDIS_PORT", 6379))
CHANNEL          = "telemetry:latest"
PING_TARGET      = os.getenv("PING_TARGET", "8.8.8.8")
PUBLISH_INTERVAL = int(os.getenv("PUBLISH_INTERVAL", 5))
PROBES           = int(os.getenv("PACKET_LOSS_PROBES", 5))
# ─────────────────────────────────────────────────────────────────────────

print(f"[collector] start → publishing every {PUBLISH_INTERVAL}s to "
      f"{REDIS_HOST}:{REDIS_PORT} channel={CHANNEL}")

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=5)

def gather_network_metrics():
    # 1) latency & packet loss
    latencies = []
    failures = 0
    for _ in range(PROBES):
        res = ping3.ping(PING_TARGET, unit="ms")
        if res is None:
            failures += 1
        else:
            latencies.append(res)
        time.sleep(0.1)

    latency_ms = round((sum(latencies) / len(latencies)) if latencies else 0, 1)
    packet_loss_pct = round((failures / PROBES) * 100, 1)

    # 2) throughput: bytes_sent+bytes_recv delta over the interval
    before = psutil.net_io_counters()
    time.sleep(1)
    after = psutil.net_io_counters()
    delta_bytes = (after.bytes_sent + after.bytes_recv) - (before.bytes_sent + before.bytes_recv)
    throughput_mbps = round((delta_bytes * 8) / 1e6, 2)

    return {
        "timestamp": time.time(),
        "latency_ms": latency_ms,
        "packet_loss_pct": packet_loss_pct,
        "throughput_mbps": throughput_mbps
    }

def main():
    while True:
        m = gather_network_metrics()
        payload = json.dumps(m)
        try:
            r.publish(CHANNEL, payload)
            print(f"[collector] published → {payload}")
        except Exception as e:
            print(f"[collector][ERROR] publish failed:", e)
        time.sleep(PUBLISH_INTERVAL)

if __name__ == "__main__":
    main()
