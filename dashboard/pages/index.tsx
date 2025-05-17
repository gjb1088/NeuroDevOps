// dashboard/pages/index.tsx
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import BrandHeader from '../components/BrandHeader';
import NetworkCard from '../components/NetworkCard';
import AIResponseCard from '../components/AIResponseCard';

interface NetTelemetry {
  timestamp: number;
  latency_ms: number;
  packet_loss_pct: number;
  throughput_mbps: number;
  jitter_ms?: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<NetTelemetry | null>(null);

  useEffect(() => {
    // Subscribe to your collector’s telemetry channel
    const socket: Socket = io(
      `${window.location.protocol}//${window.location.hostname}:4000`
    );

    socket.on("telemetry", (data) => {
    console.log("🛰️ got telemetry event:", data);
    setMetrics(data);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ socket connection error:", err);
  });


    return () => {
      socket.off('telemetry', setMetrics);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <BrandHeader />

      <section className="px-6 mt-6">
        <h2 className="text-2xl text-accent mb-2">🌐 Network Metrics:</h2>
        {metrics ? (
          <NetworkCard metrics={metrics} />
        ) : (
          <p className="text-accent italic">Waiting for network data…</p>
        )}
      </section>

      <section className="px-6 mt-8">
        <h2 className="text-2xl text-accent mb-2">🤖 AI Commentary:</h2>
        {metrics ? (
          <AIResponseCard metrics={metrics} />
        ) : (
          <p className="text-accent italic">No commentary yet.</p>
        )}
      </section>
    </>
  );
}
