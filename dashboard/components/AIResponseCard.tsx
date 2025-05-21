// dashboard/components/AIResponseCard.tsx
import { useEffect, useRef, useState } from "react";
import { NetTelemetry } from "../pages/index";

const DEBOUNCE_MS = 60_000;

type Props = { metrics: NetTelemetry };

export default function AIResponseCard({ metrics }: Props) {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const lastCall = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastCall.current < DEBOUNCE_MS) {
      // still in debounce window
      return;
    }
    lastCall.current = now;
    setLoading(true);

    // build a self-contained prompt: instructions + values
    const prompt = [
      "You are a network-operations AI assistant.",
      "You will be given exactly three metrics in this format:",
      "Latency: <number> ms",
      "Packet Loss: <number> %",
      "Throughput: <number> Mbps",
      "",
      "Interpret the numeric values *literally*.  Do NOT invent “high” or “low” unless the numbers clearly justify it.",
      "Explain the current network health in exactly two sentences, using the exact figures provided.",
      "",
      `Latency: ${metrics.latency_ms} ms`,
      `Packet Loss: ${metrics.packet_loss_pct} %`,
      `Throughput: ${metrics.throughput_mbps} Mbps`,
    ].join("\n");

    console.log("📡 AI prompt:", prompt);
const payload = JSON.stringify({ prompt });
console.log("📡 → /api/generate payload:", payload);

fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: payload,
})
      .then((r) => r.json())
      .then((j) => setResponse(j.text || j.error || "No response"))
      .catch((e) => setResponse(`❌ ${e.message}`))
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
