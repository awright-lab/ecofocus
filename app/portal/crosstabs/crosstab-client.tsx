'use client';

import { useMemo, useState } from "react";

type Question = { db_column: string; question_text: string };

type CrosstabCell = {
  row: string;
  col: string;
  count: number;
  rowPct: number;
  colPct: number;
  totalPct: number;
};

type CrosstabResult = {
  rowVar: string;
  colVar: string;
  cells: CrosstabCell[];
  totals: {
    overall: number;
    rowTotals: Record<string, number>;
    colTotals: Record<string, number>;
  };
};

export default function CrosstabClient({ questions }: { questions: Question[] }) {
  const [rowVar, setRowVar] = useState("");
  const [colVar, setColVar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CrosstabResult | null>(null);

  const onRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/portal/crosstabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowVar, colVar }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Crosstab failed");
      setResult(json);
    } catch (err: any) {
      setError(err.message || "Crosstab failed");
    } finally {
      setLoading(false);
    }
  };

  const options = useMemo(
    () =>
      questions.map((q) => (
        <option key={q.db_column} value={q.db_column}>
          {q.db_column} — {q.question_text}
        </option>
      )),
    [questions]
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-800">Row variable</label>
          <select
            value={rowVar}
            onChange={(e) => setRowVar(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select row var</option>
            {options}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Column variable</label>
          <select
            value={colVar}
            onChange={(e) => setColVar(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select column var</option>
            {options}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRun}
          disabled={!rowVar || !colVar || loading}
          className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Running…" : "Run crosstab"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {result && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">{result.rowVar} \\ {result.colVar}</th>
                {Object.keys(result.totals.colTotals).map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700">{col}</th>
                ))}
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {Object.keys(result.totals.rowTotals).map((row) => (
                <tr key={row}>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">{row}</th>
                  {Object.keys(result.totals.colTotals).map((col) => {
                    const cell = result.cells.find((c) => c.row === row && c.col === col);
                    const count = cell?.count || 0;
                    const pct = cell ? Math.round(cell.totalPct * 1000) / 10 : 0;
                    return (
                      <td key={`${row}-${col}`} className="px-3 py-2 text-gray-800">
                        <div className="flex flex-col">
                          <span>{count.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 font-semibold text-gray-800">
                    {result.totals.rowTotals[row].toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-800">Total</th>
                {Object.entries(result.totals.colTotals).map(([col, total]) => (
                  <td key={col} className="px-3 py-2 font-semibold text-gray-800">
                    {total.toLocaleString()}
                  </td>
                ))}
                <td className="px-3 py-2 font-semibold text-gray-900">
                  {result.totals.overall.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
