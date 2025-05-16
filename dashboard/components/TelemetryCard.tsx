// dashboard/components/TelemetryCard.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const WS_URL = `${window.location.protocol}//${window.location.hostname}:4000`;
const socket = io(WS_URL);

export default function TelemetryCard() {
  const [m, setM] = useState<any>(null);

  useEffect(() => {
    socket.on('telemetry', setM);
    return () => { socket.off('telemetry', setM); };
  }, []);

  if (!m) return <div>Waiting for telemetry…</div>;
  return (
    <div>
      <p>CPU: {m.cpu_percent}%</p>
      <p>RAM: {m.mem_percent}%</p>
    </div>
  );
}
