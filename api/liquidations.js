// Vercel Serverless Function — CryptoQuant Proxy
// This runs server-side so your API key is never exposed in the browser

export default async function handler(req, res) {
  // Allow requests from your domain only
  res.setHeader('Access-Control-Allow-Origin', 'https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fscottiescalps.com%2F&data=05%7C02%7C%7C31e63e7646f7490654da08debbb53e42%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639154584274886613%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=lD33r7iyyDitUx2Q4UfTPbsl5RdxCoFE9ApiXIyDHDs%3D&reserved=0');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { asset, type } = req.query;

  // Validate asset
  const validAssets = ['btc', 'eth', 'xrp'];
  if (!validAssets.includes(asset)) {
    return res.status(400).json({ error: 'Invalid asset' });
  }

  // Validate type
  const validTypes = ['long_liquidations_usd', 'short_liquidations_usd', 'long_liquidations', 'short_liquidations'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  try {
    const url = `https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fapi.cryptoquant.com%2Fv1%2F%24&data=05%7C02%7C%7C31e63e7646f7490654da08debbb53e42%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639154584274916038%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=Nb4dBHRDfY77LWgzR74TeQmbELbThu8k%2B7%2BnN4unR6c%3D&reserved=0{asset}/market-data/liquidations?window=min&exchange=all_exchange&symbol=all_symbol&limit=120`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.CQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'CryptoQuant API error', status: response.status });
    }

    const data = await response.json();

    // Cache for 60 seconds
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy error' });
  }
}
