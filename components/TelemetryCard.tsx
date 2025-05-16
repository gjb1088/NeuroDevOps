import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export function TelemetryCard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    socket.on('telemetry', (data) => {
      setMetrics(data);
    });
    // cleanup
    return () => { socket.off('telemetry'); };
  }, []);

  if (!metrics) return <div>Waiting for data…</div>;
  return (
    <div className="card">
      <p>CPU: {metrics.cpu_percent}%</p>
      <p>RAM: {metrics.mem_percent}%</p>
      {/* … */}
    </div>
  );
}
