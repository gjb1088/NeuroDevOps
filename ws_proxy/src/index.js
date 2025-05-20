// ws_proxy/src/index.js
import { createServer } from "http";
import { Server }        from "socket.io";
import Redis             from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST     || "redis";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_CHANNEL = "telemetry:latest";
const WS_PORT    = Number(process.env.WS_PORT)    || 4000;

// 1) HTTP + Socket.IO setup
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// 2) Redis subscriber
const sub = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
sub.subscribe(REDIS_CHANNEL, (err) => {
  if (err) console.error("🔴 Redis subscribe error:", err);
  else     console.log(`🟢 Subscribed to ${REDIS_CHANNEL}`);
});

// 3) On each message, JSON.parse, pick your network fields, emit
sub.on("message", (_channel, message) => {
  try {
    const data = JSON.parse(message);
    const payload = {
      timestamp:        data.timestamp,
      latency_ms:       data.latency_ms,
      packet_loss_pct:  data.packet_loss_pct,
      throughput_mbps:  data.throughput_mbps,
      jitter_ms:        data.jitter_ms ?? null,
    };
    io.emit("telemetry", payload);
  } catch (e) {
    console.warn("⚠️ ws_proxy: invalid JSON:", message);
  }
});

// 4) Launch the WS server
httpServer.listen(WS_PORT, () => {
  console.log(`🚀 WS proxy listening on port ${WS_PORT}`);
});
