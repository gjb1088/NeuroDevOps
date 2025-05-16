// dashboard/components/TelemetryCard.tsx
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Telemetry {
  timestamp: number;
  cpu_percent: number;
  mem_percent: number;
  disk_percent: number;
  net_io?: any;
}

export default function TelemetryCard() {
  const [metrics, setMetrics] = useState<Telemetry | null>(null);

  useEffect(() => {
    // Only runs in the browser
    const socket: Socket = io(
      `${window.location.protocol}//${window.location.hostname}:4000`
    );

    socket.on('telemetry', (data: Telemetry) => {
      setMetrics(data);
    });

    return () => {
      socket.off('telemetry');
      socket.disconnect();
    };
  }, []);

  if (!metrics) {
    return (
      <div className="border-green-400 border p-4 rounded text-center">
        Waiting for telemetry…
      </div>
    );
  }

  return (
    <div className="border-green-400 border p-4 rounded space-y-2">
      <div><strong>CPU:</strong> {metrics.cpu_percent.toFixed(1)}%</div>
      <div><strong>RAM:</strong> {metrics.mem_percent.toFixed(1)}%</div>
      <div><strong>Disk:</strong> {metrics.disk_percent.toFixed(1)}%</div>
      {/* You can expand this with other metrics as needed */}
    </div>
  );
}
