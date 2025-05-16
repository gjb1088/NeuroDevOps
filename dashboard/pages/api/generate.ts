
// dashboard/pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { text?: string; error?: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt } = req.body
  try {
    const upstream = await fetch(
      'http://neurodevops-ai_engine:11434/api/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      }
    )
    const json = await upstream.json()
    // Ollama’s v1 API puts the text under .completions[0].data.text
    const text =
      json.completions?.[0]?.data?.text ||
      json.choices?.[0]?.text ||
      json.text ||
      ''
    return res.status(200).json({ text })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
