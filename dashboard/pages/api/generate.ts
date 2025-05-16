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

    let json: any;
    try {
      json = JSON.parse(raw);
    } catch (parseErr) {
      console.error('❌ JSON parse error:', parseErr);
      console.error('❌ Raw body was:', raw);
      // return the raw body as the error so you can inspect it client-side if you like
      return res.status(500).json({ error: `Upstream parse error: ${parseErr.message}` });
    }

    // now extract text
    const text =
      json.completions?.[0]?.data?.text ||
      json.choices?.[0]?.text ||
      json.text ||
      '';

    console.log('🧠 parsed text:', text);
    return res.status(200).json({ text });
  } catch (e: any) {
    console.error('🔥 generate exception:', e);
    return res.status(500).json({ error: e.message });
  }
}
