import React from 'react';

export default function TransactionsTable({ items }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h3>Parsed Transactions ({items.length})</h3>
      <div
        style={{
          maxHeight: 300,
          overflow: 'auto',
          border: '1px solid #ddd',
          marginTop: 8
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7f7f7' }}>
              <th style={{ padding: 8 }}>Date</th>
              <th style={{ padding: 8 }}>Description</th>
              <th style={{ padding: 8 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, idx) => (
              <tr key={idx}>
                <td style={{ padding: 8 }}>{r.date}</td>
                <td style={{ padding: 8 }}>{r.desc}</td>
                <td style={{ padding: 8 }}>{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
