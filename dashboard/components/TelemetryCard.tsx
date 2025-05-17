// dashboard/components/TelemetryCard.tsx
import React from 'react';

interface Telemetry {
  timestamp: number;
  cpu_percent: number;
  mem_percent: number;
  disk_percent: number;
  net_io?: any;
}

type Props = { metrics: Telemetry };

export default function TelemetryCard({ metrics }: Props) {
  return (
    <div className="relative bg-burn-bg p-4 rounded-lg border border-accent shadow-neon overflow-hidden">
      {/* subtle scanline overlay */}
      <div
        className="
          absolute inset-0
          bg-[repeating-linear-gradient(
            transparent,
            transparent 3px,
            rgba(255,255,255,0.05) 3px,
            rgba(255,255,255,0.05) 4px
          )]
          pointer-events-none
        "
      />

      <ul className="relative space-y-1 font-mono text-accent">
        <li>
          <span className="font-bold">CPU:</span>{' '}
          {metrics.cpu_percent.toFixed(1)}%
        </li>
        <li>
          <span className="font-bold">RAM:</span>{' '}
          {metrics.mem_percent.toFixed(1)}%
        </li>
        <li>
          <span className="font-bold">Disk:</span>{' '}
          {metrics.disk_percent.toFixed(1)}%
        </li>
        {metrics.net_io && (
          <li>
            <span className="font-bold">Net I/O:</span>{' '}
            {metrics.net_io}
          </li>
        )}
      </ul>
    </div>
  );
}
