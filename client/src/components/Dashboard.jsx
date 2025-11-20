import React from "react";

export default function Dashboard({ analysis }) {
  const categorized = analysis.categorized || [];
  const anomalies = analysis.anomalies || [];

  const totals = {};
  categorized.forEach((t) => {
    const cat = t.category || "Other";
    totals[cat] = (totals[cat] || 0) + (Number(t.amount) || 0);
  });

  const totalSpend = Object.values(totals).reduce(
    (acc, v) => acc + (v < 0 ? v : 0),
    0
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Spending overview
        </h2>
        <span className="text-xs text-slate-500">
          Based on {categorized.length} transactions
        </span>
      </div>

      {/* Category totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(totals).map(([cat, val]) => (
          <div
            key={cat}
            className="rounded-lg border border-slate-200 px-3 py-2 bg-slate-50"
          >
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              {cat}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {val.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Summary line */}
      <div className="mt-3 text-xs text-slate-600">
        Estimated total outflow this period:{" "}
        <span className="font-semibold text-rose-600">
          {totalSpend.toFixed(2)}
        </span>
      </div>

      {/* Anomalies */}
      <div className="mt-4">
        <h3 className="text-xs font-semibold text-slate-800 mb-1">
          Unusually large transactions
        </h3>
        {anomalies.length === 0 ? (
          <p className="text-xs text-slate-500">
            Nothing stands out. If you expect a big one-time purchase, it may
            appear here.
          </p>
        ) : (
          <ul className="space-y-1 text-xs text-slate-700">
            {anomalies.map((a, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-2 rounded-md bg-amber-50 border border-amber-200 px-2 py-1"
              >
                <div>
                  <p className="font-medium">
                    {a.desc || "(no description)"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {a.date} • {a.category}
                  </p>
                </div>
                <span className="font-semibold text-rose-600 whitespace-nowrap">
                  {Number(a.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        This is not an official financial tool. Use it as a rough guide to
        understand your spending patterns, then confirm details via your bank.
      </p>
    </div>
  );
}
