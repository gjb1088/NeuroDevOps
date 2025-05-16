const Redis = require('ioredis');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Redis connection & channel
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379
});
const CHANNEL = 'telemetry:latest';

// HTTP + Socket.IO setup
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' }  // tighten in prod
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
});

// Subscribe to Redis channel and broadcast
redis.subscribe(CHANNEL, (err) => {
  if (err) console.error('Redis subscribe error', err);
  else console.log(`Subscribed to ${CHANNEL}`);
});
redis.on('message', (chan, message) => {
  if (chan === CHANNEL) {
    io.emit('telemetry', JSON.parse(message));
  }
});

// Start server
const PORT = process.env.WS_PORT || 4000;
httpServer.listen(PORT, () =>
  console.log(`WS proxy listening on port ${PORT}`)
);
