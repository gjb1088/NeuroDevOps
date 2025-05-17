// dashboard/components/NetworkCard.tsx
import React from 'react';

interface NetTelemetry {
  latency_ms: number;
  packet_loss_pct: number;
  throughput_mbps: number;
  jitter_ms?: number;
}

export default function NetworkCard({ metrics }: { metrics: NetTelemetry }) {
  return (
    <div className="relative bg-burn-bg p-4 rounded-lg border border-accent shadow-neon overflow-hidden">
      {/* scanlines */}
      <div
        className="
          absolute inset-0
          bg-[repeating-linear-gradient(
            transparent,transparent 3px,
            rgba(255,255,255,0.05) 3px,
            rgba(255,255,255,0.05) 4px
          )]
          pointer-events-none
        "
      />

      <ul className="relative space-y-1 font-mono text-accent">
        <li>
          <span className="font-bold">Latency:</span> {metrics.latency_ms} ms
        </li>
        <li>
          <span className="font-bold">Packet Loss:</span> {metrics.packet_loss_pct}%
        </li>
        <li>
          <span className="font-bold">Throughput:</span> {metrics.throughput_mbps} Mbps
        </li>
        {metrics.jitter_ms != null && (
          <li>
            <span className="font-bold">Jitter:</span> {metrics.jitter_ms} ms
          </li>
        )}
      </ul>
    </div>
  );
}
