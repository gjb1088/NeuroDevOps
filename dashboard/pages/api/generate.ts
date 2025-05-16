// dashboard/pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { text?: string; error?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // Log the incoming prompt
  console.log('🧠 prompt:', prompt);

  try {
    const upstream = await fetch(
      'http://ai_engine:11434/api/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          prompt
        })
      }
    );

    // Parse and log the raw JSON from Ollama
    const json = await upstream.json();
    console.log('🧠 ai_engine replied:', json);

    const text =
      json.completions?.[0]?.data?.text ||
      json.choices?.[0]?.text ||
      json.text ||
      '';

    return res.status(200).json({ text });
  } catch (e: any) {
    console.error('🧠 generate error:', e);
    return res.status(500).json({ error: e.message });
  }
}
