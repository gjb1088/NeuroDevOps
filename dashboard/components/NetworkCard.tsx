// dashboard/components/NetworkCard.tsx
import { NetTelemetry } from "../pages/index";

type Props = { metrics: NetTelemetry };

export default function NetworkCard({ metrics }: Props) {
  const { latency_ms, packet_loss_pct, throughput_mbps } = metrics;

  return (
    <div className="border-green-400 border rounded p-4 bg-gray-900 text-green-300">
      <p>Latency: {latency_ms} ms</p>
      <p>Packet Loss: {packet_loss_pct} %</p>
      <p>Throughput: {throughput_mbps} Mbps</p>
    </div>
  );
}
