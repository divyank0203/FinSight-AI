function detectAnomalies(transactions) {
  const byCat = {};

  for (const t of transactions) {
    const c = t.category || 'Other';
    byCat[c] = byCat[c] || [];
    byCat[c].push(Math.abs(Number(t.amount || 0)));
  }

  const stats = {};
  for (const [c, arr] of Object.entries(byCat)) {
    if (!arr.length) continue;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + (b - mean) * (b - mean), 0) / arr.length;
    const sd = Math.sqrt(variance);
    stats[c] = { mean, sd };
  }

  const anomalies = [];
  for (const t of transactions) {
    const c = t.category || 'Other';
    const val = Math.abs(Number(t.amount || 0));
    const s = stats[c];
    if (s && val > s.mean + 3 * s.sd && val > 0) {
      anomalies.push(t);
    }
  }

  return anomalies;
}

module.exports = { detectAnomalies };
