const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { asset } = req.query;

  const validAssets = ['btc', 'eth', 'xrp'];
  if (!validAssets.includes(asset)) {
    return res.status(400).json({ error: 'Invalid asset' });
  }

  try {
    const url = `https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fapi.cryptoquant.com%2Fv1%2F%24&data=05%7C02%7C%7Cb420e4b91f19462bd54d08debcb8cb80%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639155699032410739%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=rrUdFYVGjXfKEhkszEOkyreIcZlrbSGoVG3%2F1i2VjY0%3D&reserved=0{asset}/market-data/liquidations?window=min&exchange=all_exchange&limit=120`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${process.env.CQ_API_KEY}` }
    });

    res.setHeader('Cache-Control', 's-maxage=60');
    return res.status(200).json(response.data);

  } catch(error) {
    return res.status(error.response?.status || 500).json({
      error: error.response?.data,
      status: error.response?.status
    });
  }
}
