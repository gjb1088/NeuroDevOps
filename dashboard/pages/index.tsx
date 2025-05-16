// dashboard/pages/index.tsx
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import BrandHeader from '../components/BrandHeader';
import TelemetryCard from '../components/TelemetryCard';
import AIResponseCard from '../components/AIResponseCard';

export default function Home() {
  const [metrics, setMetrics] = useState(null);
  useEffect(() => {
    const socket: Socket = io(`${window.location.protocol}//${window.location.hostname}:4000`);
    socket.on('telemetry', setMetrics);
     return () => {
     socket.off('telemetry', setMetrics);
     socket.disconnect();             // now returns void
   };
  }, []);

  return (
    <>
      <BrandHeader />

      <section className="px-6">
        <h2 className="text-2xl text-accent mb-2">💻 System Input:</h2>
        {metrics && <TelemetryCard metrics={metrics} />}
      </section>

      <section className="px-6 mt-8">
        <h2 className="text-2xl text-accent mb-2">🤖 Mistral Response:</h2>
        {metrics && <AIResponseCard metrics={metrics} />}
      </section>
    </>
  );
}
