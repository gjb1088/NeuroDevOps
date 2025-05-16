// dashboard/components/AIResponseCard.tsx
import { useEffect, useRef, useState } from 'react';

interface Telemetry {
  timestamp: number;
  cpu_percent: number;
  mem_percent: number;
  disk_percent: number;
  net_io?: any;
}

interface AIResponseCardProps {
  metrics: Telemetry;
}

// Debounce interval (ms) – only call once per 30 seconds
const DEBOUNCE_MS = 60_000;

export default function AIResponseCard({ metrics }: AIResponseCardProps) {
  const lastRun = useRef(0);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Helper to build the prompt from metrics
  const buildPrompt = (m: Telemetry) => `
[CPU usage: ${m.cpu_percent.toFixed(1)}%]
[Memory usage: ${m.mem_percent.toFixed(1)}%]
[Disk usage: ${m.disk_percent.toFixed(1)}%]
Explain the system status in plain English.
`;

  useEffect(() => {
    const now = Date.now();
    // skip if we ran recently
    if (now - lastRun.current < DEBOUNCE_MS) return;
    lastRun.current = now;

    setLoading(true);
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'mistral', prompt: buildPrompt(metrics) })
    })
      .then((res) => res.json())
      .then((json) => setResponse(json.text || 'No response'))
      .catch((err) => setResponse(`Error: ${err.message}`))
      .finally(() => setLoading(false));
  }, [metrics]);

  return (
    <div className="border-green-400 border p-4 rounded bg-gray-900">
      {loading && <div className="italic">Generating AI response…</div>}
      {!loading && response && (
        <pre className="whitespace-pre-wrap font-mono">{response}</pre>
      )}
    </div>
  );
}
