const categoryMap = require('../models/category_map.json');

function categorizeTransactions(txns) {
  return txns.map(t => {
    const desc = (t.desc || '').toLowerCase();
    let category = 'Other';

    for (const [cat, tokens] of Object.entries(categoryMap)) {
      for (const token of tokens) {
        if (!token) continue;
        if (desc.includes(token.toLowerCase())) {
          category = cat;
          break;
        }
      }
      if (category !== 'Other') break;
    }

    if (t.amount && Math.abs(t.amount) > 10000) {
      category += ' | HighValue';
    }

    return { ...t, category };
  });
}

module.exports = { categorizeTransactions };
