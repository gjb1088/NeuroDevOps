// dashboard/components/AIResponseCard.tsx
import { useEffect, useRef, useState } from "react";
import { NetTelemetry } from "../pages/index";

const DEBOUNCE_MS = 60_000;

type Props = { metrics: NetTelemetry };

export default function AIResponseCard({ metrics }: Props) {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const lastCall = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastCall.current < DEBOUNCE_MS) {
      // skip: still in debounce window
      return;
    }
    lastCall.current = now;
    setLoading(true);

    // build a short prompt with only the three network metrics
    const prompt = `
Latency: ${metrics.latency_ms} ms
Packet Loss: ${metrics.packet_loss_pct} %
Throughput: ${metrics.throughput_mbps} Mbps
Explain the current network health and any issues in two sentences.
`;

    console.log("📡 AI prompt:", prompt)

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((r) => r.json())
      .then((j) => {
        setResponse(j.text || j.error || "No response");
      })
      .catch((e) => {
        setResponse(`❌ ${e.message}`);
      })
      .finally(() => setLoading(false));
  }, [metrics]);

  return (
    <div className="border-green-400 border rounded p-4 bg-gray-900 text-green-300">
      {loading ? (
        <p className="italic">Analyzing network data…</p>
      ) : (
        <p>{response}</p>
      )}
    </div>
  );
}
