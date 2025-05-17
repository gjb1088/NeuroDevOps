// dashboard/components/NetworkCard.tsx
import React from 'react';

export interface NetTelemetry {
  timestamp:       number;
  latency_ms:      number;
  packet_loss_pct: number;
  throughput_mbps: number;
  jitter_ms?:      number;
}

type Props = { metrics: NetTelemetry };

export default function NetworkCard({ metrics }: Props) {
  const { latency_ms, packet_loss_pct, throughput_mbps, jitter_ms } = metrics;

  return (
    <div className="relative bg-burn-bg p-4 rounded-lg border border-accent shadow-neon overflow-hidden">
      {/* scanline overlay */}
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
          <span className="font-bold">Latency:</span> {latency_ms} ms
        </li>
        <li>
          <span className="font-bold">Packet Loss:</span> {packet_loss_pct} %
        </li>
        <li>
          <span className="font-bold">Throughput:</span> {throughput_mbps} Mbps
        </li>
        {jitter_ms != null && (
          <li>
            <span className="font-bold">Jitter:</span> {jitter_ms} ms
          </li>
        )}
      </ul>
    </div>
  );
}
