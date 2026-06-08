// api/generate.js — Vercel Serverless Function
// Calls D-ID API using DID_API_KEY from Vercel Environment Variables

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const didKey = process.env.DID_API_KEY;
  if (!didKey) return res.status(500).json({ error: 'DID_API_KEY not set in Vercel environment variables' });

  const { photoUrl, script, language } = req.body;
  if (!photoUrl || !script) return res.status(400).json({ error: 'photoUrl and script required' });

  // Microsoft Neural voices — all free on D-ID
  const voiceMap = {
    hi: 'hi-IN-MadhurNeural',
    en: 'en-US-GuyNeural',
    ta: 'ta-IN-ValluvarNeural',
    te: 'te-IN-MohanNeural',
    mr: 'mr-IN-ManoharNeural',
    bn: 'bn-IN-BashkarNeural',
    gu: 'gu-IN-NiranjanNeural',
    pa: 'pa-IN-OjasNeural',
    es: 'es-ES-AlvaroNeural',
    ar: 'ar-SA-HamedNeural',
    fr: 'fr-FR-HenriNeural',
    zh: 'zh-CN-YunxiNeural'
  };
  const voiceId = voiceMap[language] || 'hi-IN-MadhurNeural';

  try {
    const resp = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(didKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        source_url: photoUrl,
        script: {
          type: 'text',
          input: script,
          provider: { type: 'microsoft', voice_id: voiceId }
        },
        config: { fluent: true, pad_audio: 0 }
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(500).json({ error: data?.description || 'D-ID generation failed', detail: data });
    }

    res.json({ jobId: data.id, status: data.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
