const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { asset } = req.query;
  const url = `https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fapi.cryptoquant.com%2Fv1%2F%24&data=05%7C02%7C%7Ccd9cb7aa7943496f58eb08debbff70b4%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639154902931742468%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=HpbIL2PkOpTQjSIbDbaXGS%2BtI7sE1zIMg3e5pcSFnO8%3D&reserved=0{asset}/market-data/liquidations?window=min&exchange=all_exchange&symbol=all_symbol&limit=120`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${process.env.CQ_API_KEY}` }
    });
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(error.response?.status || 500).json(error.response?.data);
  }
}
