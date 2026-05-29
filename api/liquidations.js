export default async function handler(req, res) {
  const { asset } = req.query;
  const key = process.env.CQ_API_KEY;

  if (!asset || !key) return res.status(400).json({ error: 'Missing asset or key' });

  const url = `https://api.cryptoquant.com/v1/${asset}/market-data/liquidations?window=min&exchange=all_exchange&limit=120`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${key}` }
    });

    if (!response.ok) return res.status(response.status).json({ error: `CQ ${response.status}` });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}