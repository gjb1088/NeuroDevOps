// dashboard/components/AIResponseCard.tsx
import { useEffect, useState } from 'react'
import type { NetTelemetry } from './NetworkCard'  // <-- pull in your new interface

type Props = { metrics: NetTelemetry }

export default function AIResponseCard({ metrics }: Props) {
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    async function fetchAnalysis() {
      setLoading(true)
      // Build the network‐only prompt
      let prompt = 
        `[Latency: ${metrics.latency_ms} ms] ` +
        `[Packet Loss: ${metrics.packet_loss_pct}%] ` +
        `[Throughput: ${metrics.throughput_mbps} Mbps]`
      if (metrics.jitter_ms != null) {
        prompt += ` [Jitter: ${metrics.jitter_ms} ms]`
      }
      prompt += ' Explain the network health and any potential issues in two sentences.'

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)  // <― POST the raw metrics object to your updated handler
      })
      const json = await res.json()
      setResponse(json.text ?? json.error ?? 'No response')
      setLoading(false)
    }

    fetchAnalysis()
  }, [metrics])

  return (
    <div className="relative bg-burn-bg p-4 rounded-lg border border-accent shadow-neon overflow-auto">
      {loading && <p className="italic">Analyzing network data…</p>}
      {!loading && response && (
        <p className="whitespace-pre-wrap text-accent">{response}</p>
      )}
    </div>
  )
}
