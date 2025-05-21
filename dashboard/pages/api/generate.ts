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

  // 1) Destructure your network metrics instead of a raw `prompt` string
  const {
    latency_ms,
    packet_loss_pct,
    throughput_mbps,
    jitter_ms
  } = req.body as {
    latency_ms: number;
    packet_loss_pct: number;
    throughput_mbps: number;
    jitter_ms?: number;
  };

  // 2) Build your prompt from those fields
  const promptLines = [
    `[Latency: ${latency_ms} ms]`,
    `[Packet Loss: ${packet_loss_pct}%]`,
    `[Throughput: ${throughput_mbps} Mbps]`,
  ];
  if (typeof jitter_ms === 'number') {
    promptLines.push(`[Jitter: ${jitter_ms} ms]`);
  }
  promptLines.push(
    'Explain the network health and any potential issues in two sentences.'
  );
  const prompt = promptLines.join(' ');

  console.log("🧠 /api/generate — forwarding prompt:", prompt);

  try {
    const upstream = await fetch(
      'http://ai_engine:11434/api/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          prompt,
          stream: false
        })
      }
    );

    const raw = await upstream.text();
    console.log('🧠 ai_engine raw response:', raw);

    // 3) Stitch together line‐by‐line JSON chunks (same as before)
    const lines = raw.split(/\r?\n/).filter((l) => l.trim());
    let text = '';
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (typeof obj.response === 'string') {
          text += obj.response;
        }
      } catch {
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
