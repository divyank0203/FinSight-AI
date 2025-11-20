const express = require('express');
const { categorizeTransactions } = require('../utils/categorizer');
const { detectAnomalies } = require('../utils/anomaly');

const router = express.Router();

router.post('/', (req, res) => {
  const tx = req.body.transactions || [];
  if (!tx.length) {
    return res.status(400).json({ error: 'No transactions provided' });
  }

  const categorized = categorizeTransactions(tx);
  const anomalies = detectAnomalies(categorized);

  res.json({ categorized, anomalies });
});

module.exports = router;
