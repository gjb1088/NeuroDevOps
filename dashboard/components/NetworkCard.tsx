import { NetTelemetry } from "../pages/index";

export default function NetworkCard({ metrics }: { metrics: NetTelemetry }) {
  return (
    <div className="border-accent border rounded p-4">
      <div>Latency:       <strong>{metrics.latency_ms} ms</strong></div>
      <div>Packet Loss:   <strong>{metrics.packet_loss_pct}%</strong></div>
      <div>Throughput:    <strong>{metrics.throughput_mbps} Mbps</strong></div>
      {metrics.jitter_ms != null && (
        <div>Jitter:        <strong>{metrics.jitter_ms} ms</strong></div>
      )}
    </div>
  );
}
