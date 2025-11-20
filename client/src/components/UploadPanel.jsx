import React, { useState } from "react";
import { uploadFile, analyzeTransactions } from "../api/api";
import TransactionsTable from "./TransactionsTable";
import Dashboard from "./Dashboard";

export default function UploadPanel() {
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a statement file first");
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await uploadFile(form);
      setTransactions(res.data.transactions || []);
      setAnalysis(null);
    } catch (err) {
      console.error(err);
      alert("Upload or parsing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!transactions.length) return alert("No transactions to analyze");
    setLoading(true);
    try {
      const res = await analyzeTransactions(transactions);
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr,1.2fr]">
      {/* Left card: upload & raw table */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="text-base font-semibold text-slate-900">
            Upload statement
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Supported formats: CSV, TXT, basic PDF exports from banks.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col items-start gap-2">
              <span className="text-xs font-medium text-slate-600">
                Bank statement file
              </span>
              <input
                type="file"
                accept=".csv,.txt,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-slate-700
                           file:mr-4 file:py-1.5 file:px-3
                           file:rounded-full file:border-0
                           file:text-xs file:font-semibold
                           file:bg-indigo-50 file:text-indigo-700
                           hover:file:bg-indigo-100"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={handleUpload}
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium
                           bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Uploading…" : "Upload & parse"}
              </button>
              <button
                onClick={handleAnalyze}
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium
                           border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-60"
                disabled={loading || !transactions.length}
              >
                {loading ? "Analyzing…" : "Analyze spending"}
              </button>
            </div>

            {file && (
              <div className="text-xs text-slate-500">
                Selected: <span className="font-medium">{file.name}</span>
              </div>
            )}
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <TransactionsTable items={transactions} />
          </div>
        )}
      </div>

      {/* Right card: analysis dashboard */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-h-[220px]">
        {analysis ? (
          <Dashboard analysis={analysis} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-sm text-slate-500">
            <p className="font-medium text-slate-600">
              No analysis yet
            </p>
            <p className="mt-1">
              Upload a statement and click <span className="font-semibold">“Analyze spending”</span>{" "}
              to see category totals and unusual transactions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
