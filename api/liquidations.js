const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
 
  const key = process.env.CQ_API_KEY;
  console.log("Key length:", key?.length, "Starts with:", key?.substring(0,8));
 
  const { asset } = req.query;
  const url = `https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fapi.cryptoquant.com%2Fv1%2F%24&data=05%7C02%7C%7Ca201b96a8d364a4ce66308debc0e6fa2%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639154967341347370%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=tjkzY%2Bh%2B48d8PcHvfDKR4gMaY8IZu9Z81jXK3fBnUEA%3D&reserved=0{asset}/market-data/liquidations?window=min&exchange=all_exchange&symbol=all_symbol&limit=120`;
 
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${key}` }
    });
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(error.response?.status || 500).json({
      error: error.response?.data,
      keyLength: key?.length,
      keyStart: key?.substring(0,8)
    });
  }
}
