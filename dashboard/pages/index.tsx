import TelemetryCard from '../components/TelemetryCard';

export default function Home() {
  return (
    <main className="p-4 bg-black text-green-400 font-mono min-h-screen">
      <h1 className="text-2xl mb-4">NeuroDevOps Dashboard</h1>
      <TelemetryCard />
    </main>
  );
}
