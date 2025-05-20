// ws_proxy/src/index.js
const http   = require("http");
const { Server } = require("socket.io");
const Redis  = require("ioredis");

const REDIS_HOST    = process.env.REDIS_HOST    || "redis";
const REDIS_PORT    = +process.env.REDIS_PORT   || 6379;
const REDIS_CHANNEL = "telemetry:latest";
const WS_PORT       = +process.env.WS_PORT      || 4000;

// 1) HTTP + Socket.IO, allow CORS from your dashboard
const server = http.createServer();
const io     = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.1.156:3000"
    ],
    methods: ["GET","POST"],
    credentials: true
  }
});

// 2) Redis subscriber
const sub = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
sub.subscribe(REDIS_CHANNEL, (err) => {
  if (err) console.error("🔴 Redis subscribe error:", err);
  else     console.log("🟢 Subscribed to", REDIS_CHANNEL);
});

// 3) On each message parse & emit only your network metrics
sub.on("message", (_chan, msg) => {
  try {
    const d = JSON.parse(msg);
    io.emit("telemetry", {
      timestamp:       d.timestamp,
      latency_ms:      d.latency_ms,
      packet_loss_pct: d.packet_loss_pct,
      throughput_mbps: d.throughput_mbps,
      jitter_ms:       d.jitter_ms ?? null,
    });
  } catch (e) {
    console.warn("⚠️ bad JSON from Redis:", msg);
  }
});

// 4) start
server.listen(WS_PORT, () => {
  console.log(`🚀 WS proxy listening on port ${WS_PORT}`);
});
