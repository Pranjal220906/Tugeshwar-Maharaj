// api/translate.js — Vercel Serverless Function
// Uses MyMemory — 100% FREE, no key needed

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, targetLang } = req.body;
  if (!text || !targetLang) return res.status(400).json({ error: 'text and targetLang required' });

  try {
    const encoded = encodeURIComponent(text.slice(0, 500));
    const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|${targetLang}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const translated = data?.responseData?.translatedText || text;
    res.json({ translated });
  } catch (err) {
    res.json({ translated: text }); // fallback to original
  }
}
