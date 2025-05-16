// dashboard/components/TelemetryCard.tsx
import React from 'react';

export interface Telemetry {
  timestamp: number;
  cpu_percent: number;
  mem_percent: number;
  disk_percent: number;
  net_io?: any;
}

interface TelemetryCardProps {
  metrics: Telemetry;
}

export default function TelemetryCard({ metrics }: TelemetryCardProps) {
  return (
    <div className="border-green-400 border p-4 rounded space-y-2 bg-gray-900">
      <div><strong>CPU:</strong> {metrics.cpu_percent.toFixed(1)}%</div>
      <div><strong>RAM:</strong> {metrics.mem_percent.toFixed(1)}%</div>
      <div><strong>Disk:</strong> {metrics.disk_percent.toFixed(1)}%</div>
    </div>
  );
}
