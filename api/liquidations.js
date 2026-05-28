const axios = require('axios');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const asset = req.query.asset;

  if (!['btc', 'eth', 'xrp'].includes(asset)) {
    return res.status(400).json({ error: 'Invalid asset' });
  }

  const url = 'https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fapi.cryptoquant.com%2Fv1%2F&data=05%7C02%7C%7C917325d444a2406e4b1208debcc2a45e%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639155741322201260%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=RaiYqnlOqS0inJeF8HQEIND7%2FjYlZUtOyf3dB1b8Hpw%3D&reserved=0' + asset + '/market-data/liquidations?window=min&exchange=all_exchange&limit=120';

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': 'Bearer ' + process.env.CQ_API_KEY
      }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Server error',
      status: error.response ? error.response.status : 500
    });
  }
};
