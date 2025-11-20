import React from "react";
import UploadPanel from "./components/UploadPanel";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                FinSight
              </h1>
              <p className="text-xs text-slate-500">
                Monthly statement → clean, simple view of your spending
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500">
            Demo • Upload a CSV or PDF from your bank
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <UploadPanel />
      </main>
    </div>
  );
}
