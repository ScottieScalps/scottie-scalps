export default async function handler(req, res) {
  const { asset } = req.query;
  const key = process.env.CQ_API_KEY;

  if (!asset) {
    return res.status(400).json({ error: 'Asset required' });
  }

  const url = `https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fapi.cryptoquant.com%2Fv1%2F%24&data=05%7C02%7C%7Cc75b70a530274ffc298108debd4eff92%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639156344151694530%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=%2FIwKYbMmQk%2FPRtAPcf0Ez8XPtGbDStxkAR%2BMRapmW1g%3D&reserved=0{asset}/market-data/liquidations?window=min&exchange=all_exchange&limit=120`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${key}` }
    });

    if (!response.ok) throw new Error(`CQ error: ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
