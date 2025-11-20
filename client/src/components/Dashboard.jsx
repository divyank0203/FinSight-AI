import React from 'react';

export default function Dashboard({ analysis }) {
  const categorized = analysis.categorized || [];
  const anomalies = analysis.anomalies || [];

  const totals = {};
  categorized.forEach((t) => {
    const cat = t.category || 'Other';
    totals[cat] = (totals[cat] || 0) + (Number(t.amount) || 0);
  });

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Analysis</h3>
      <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <h4>Category totals</h4>
          <ul>
            {Object.entries(totals).map(([k, v]) => (
              <li key={k}>
                {k}: {v.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h4>Anomalies (unusually large txns)</h4>
          {anomalies.length === 0 ? (
            <div>No anomalies detected</div>
          ) : (
            <ul>
              {anomalies.map((a, i) => (
                <li key={i}>
                  {a.date} — {a.desc} — {a.amount} ({a.category})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
