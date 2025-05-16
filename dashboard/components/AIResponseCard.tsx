// dashboard/components/AIResponseCard.tsx
import { useEffect, useState } from 'react'

interface Telemetry {
  timestamp: number
  cpu_percent: number
  mem_percent: number
  disk_percent: number
  net_io?: any
}

export default function AIResponseCard({
  metrics
}: {
  metrics: Telemetry
}) {
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    async function run() {
      setLoading(true)
      // Build the same prompt you had before:
      const prompt = `
[CPU usage: ${metrics.cpu_percent}%]
[Memory usage: ${metrics.mem_percent}%]
[Disk usage: ${metrics.disk_percent}%]
Explain the system status in plain English.
`
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const { text } = await res.json()
      setResponse(text || 'No response')
      setLoading(false)
    }
    run()
  }, [metrics])

  if (loading) {
    return <div className="italic">Generating AI response…</div>
  }
  if (!response) {
    return null
  }

  const preview = response.slice(0, 250).trim()
  const isLong = response.length > 250

  return (
    <div className="border-green-400 border p-4 rounded bg-gray-900">
      <pre className="whitespace-pre-wrap font-mono">
        {expanded || !isLong ? response : preview + '…'}
      </pre>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm underline"
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  )
}
