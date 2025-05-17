// dashboard/components/TelemetryCard.tsx
import React from 'react';

interface NetIO {
  bytes_sent?: number;
  bytes_recv?: number;
  [key: string]: any;
}

interface NetTelemetry {
  timestamp:   number;
  latency_ms:  number;   // ping round-trip in ms
  packet_loss_pct: number;
  throughput_mbps:  number;
  jitter_ms?:       number;  // optional
}

type Props = { metrics: Telemetry };

export default function TelemetryCard({ metrics }: Props) {
  const { cpu_percent, mem_percent, disk_percent, net_io } = metrics;

  return (
    <div className="relative bg-burn-bg p-4 rounded-lg border border-accent shadow-neon overflow-hidden">
      {/* Scanline overlay */}
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
          <span className="font-bold">CPU:</span> {cpu_percent.toFixed(1)}%
        </li>
        <li>
          <span className="font-bold">RAM:</span> {mem_percent.toFixed(1)}%
        </li>
        <li>
          <span className="font-bold">Disk:</span> {disk_percent.toFixed(1)}%
        </li>

        {net_io && (
          <li>
            <span className="font-bold">Net I/O:</span>{' '}
            {typeof net_io.bytes_sent === 'number' &&
             typeof net_io.bytes_recv === 'number' ? (
              <>
                Sent {net_io.bytes_sent} bytes / Recv {net_io.bytes_recv} bytes
              </>
            ) : (
              /* fallback for unknown shape */
              JSON.stringify(net_io)
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
