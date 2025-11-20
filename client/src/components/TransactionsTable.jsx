import React from "react";

export default function TransactionsTable({ items }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-900">
          Parsed transactions
        </h3>
        <span className="text-xs text-slate-500">
          {items.length} rows
        </span>
      </div>
      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-72 overflow-y-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Description</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((tx, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                  {tx.date}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {tx.desc}
                </td>
                <td
                  className={`px-3 py-2 text-right font-medium ${
                    Number(tx.amount) < 0
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {Number(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No transactions parsed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        This is a simplified view based on the columns Date, Description, and Amount from your statement.
      </p>
    </div>
  );
}
