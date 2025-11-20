import React, { useState } from 'react';
import { uploadFile, analyzeTransactions } from '../api/api';
import TransactionsTable from './TransactionsTable';
import Dashboard from './Dashboard';

export default function UploadPanel() {
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Select a statement file first');
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await uploadFile(form);
      setTransactions(res.data.transactions || []);
      setAnalysis(null);
    } catch (err) {
      console.error(err);
      alert('Upload or parsing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!transactions.length) return alert('No transactions to analyze');
    setLoading(true);
    try {
      const res = await analyzeTransactions(transactions);
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <input
          type="file"
          accept=".csv,.txt,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload} style={{ marginLeft: 8 }}>
          Upload & Parse
        </button>
        <button onClick={handleAnalyze} style={{ marginLeft: 8 }}>
          Analyze
        </button>
      </div>

      {loading && <div>Processing…</div>}

      {analysis && <Dashboard analysis={analysis} />}

      {transactions.length > 0 && <TransactionsTable items={transactions} />}
    </div>
  );
}
