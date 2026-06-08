// api/upload.js — Vercel Serverless Function
// Receives base64 image from frontend, returns it as a usable URL via D-ID

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image data' });

    // Return the data URL — D-ID accepts base64 image URLs directly
    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;
    res.json({ url: dataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
