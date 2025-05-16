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
  console.log('🧠 prompt:', prompt);

  try {
    const upstream = await fetch('http://ai_engine:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'mistral', prompt, stream: false })
    });

    const raw = await upstream.text();
    console.log('🧠 ai_engine raw response:', raw);

    // Split out each line of JSON, parse it, and accumulate the "response" fields
    const lines = raw
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0);
    let text = '';
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (typeof obj.response === 'string') {
          text += obj.response;
        }
      } catch (e) {
        console.warn('⚠️ skipping unparsable chunk:', line);
      }
    }

    console.log('🧠 stitched text:', text);
    return res.status(200).json({ text });
  } catch (e: any) {
    console.error('🔥 generate exception:', e);
    return res.status(500).json({ error: e.message });
  }
}
