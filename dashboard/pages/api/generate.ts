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
  try {
    const upstream = await fetch(
      'http://ai_engine:11434/api/generate',    // make sure 'ai_engine' is an alias
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',   // explicitly specify the model
          prompt
        })
      }
    );

    const json = await upstream.json();
    const text =
      json.completions?.[0]?.data?.text ||
      json.choices?.[0]?.text ||
      json.text ||
      '';

    return res.status(200).json({ text });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
