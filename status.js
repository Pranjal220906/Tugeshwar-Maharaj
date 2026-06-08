// api/status.js — Vercel Serverless Function
// Polls D-ID for video completion

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const didKey = process.env.DID_API_KEY;
  if (!didKey) return res.status(500).json({ error: 'DID_API_KEY not set' });

  const { jobId } = req.query;
  if (!jobId) return res.status(400).json({ error: 'jobId required' });

  try {
    const resp = await fetch(`https://api.d-id.com/talks/${jobId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(didKey + ':').toString('base64')}`,
        'Accept': 'application/json'
      }
    });

    const data = await resp.json();
    res.json({
      status: data.status,
      videoUrl: data.result_url || null,
      error: data.error || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
