// dashboard/components/TelemetryCard.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function TelemetryCard() {
  const [m, setM] = useState<{ cpu_percent: number; mem_percent: number } | null>(null);

  useEffect(() => {
    socket.on('telemetry', data => setM(data));
    return () => { socket.off('telemetry'); };
  }, []);

  if (!m) return <div>Waiting for telemetry…</div>;
  return (
    <div className="border-green-400 border p-2 rounded">
      <p>CPU: {m.cpu_percent}%</p>
      <p>RAM: {m.mem_percent}%</p>
    </div>
  );
}
