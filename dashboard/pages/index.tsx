// dashboard/pages/index.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import TelemetryCard from '../components/TelemetryCard';
import AIResponseCard from '../components/AIResponseCard';

interface Telemetry {
  timestamp: number;
  cpu_percent: number;
  mem_percent: number;
  disk_percent: number;
  net_io?: any;
}

export default function Home() {
  const [metrics, setMetrics] = useState<Telemetry | null>(null);

  useEffect(() => {
    const socket = io(
      `${window.location.protocol}//${window.location.hostname}:4000`
    );
    socket.on('telemetry', setMetrics);
    return () => {
      socket.off('telemetry', setMetrics);
      socket.disconnect();
    };
  }, []);

  return (
    <main className="p-6 bg-burn-bg text-burn-neon font-mono min-h-screen">
      {/* 🔥 Neon‐glow + flicker header */}
      <h1
        className="
          text-4xl md:text-5xl lg:text-6xl
          font-extrabold
          text-shadow-neon
          flicker
          mb-8
        "
      >
        🧠 NeuroDevOps AI Dashboard
      </h1>

      {/* System Input */}
      {metrics && (
        <div className="mb-6">
          <h2 className="text-xl mb-2">💻 System Input:</h2>
          <TelemetryCard metrics={metrics} />
        </div>
      )}

      {/* Mistral Response */}
      {metrics && (
        <div>
          <h2 className="text-xl mb-2">🤖 Mistral Response:</h2>
          <AIResponseCard metrics={metrics} />
        </div>
      )}
    </main>
  );
}
