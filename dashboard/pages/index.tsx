// dashboard/pages/index.tsx
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import BrandHeader from "../components/BrandHeader";
import NetworkCard from "../components/NetworkCard";
import AIResponseCard from "../components/AIResponseCard";

export interface NetTelemetry {
  timestamp: number;
  latency_ms: number;
  packet_loss_pct: number;
  throughput_mbps: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<NetTelemetry | null>(null);

  useEffect(() => {
    const socket: Socket = io(
      `${window.location.protocol}//${window.location.hostname}:4000`
    );
    socket.on("telemetry", (m: NetTelemetry) => {
      console.log("🛰️ got telemetry event:", m);
      setMetrics(m);
    });
    return () => {
      socket.off("telemetry");
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <BrandHeader />

      <section className="px-6 mt-8">
        <h2 className="text-2xl text-accent mb-2">🌐 Network Metrics:</h2>
        {metrics ? (
          <NetworkCard metrics={metrics} />
        ) : (
          <p className="italic text-accent">Waiting for network data…</p>
        )}
      </section>

      <section className="px-6 mt-10">
        <h2 className="text-2xl text-accent mb-2">🤖 AI Commentary:</h2>
        {metrics ? (
          <AIResponseCard metrics={metrics} />
        ) : (
          <p className="italic text-accent">No commentary yet.</p>
        )}
      </section>
    </>
  );
}
