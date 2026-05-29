const axios = require('axios');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const asset = req.query.asset;

  if (!['btc', 'eth', 'xrp'].includes(asset)) {
    return res.status(400).json({ error: 'Invalid asset' });
  }

  const url = 'https://api.cryptoquant.com/v1/' + asset + '/market-data/liquidations?window=min&exchange=all_exchange&limit=120';

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
