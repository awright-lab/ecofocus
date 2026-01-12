'use client';

import { useEffect, useMemo, useState } from "react";

type QuestionRow = {
  db_column: string;
  question_text: string;
};

export default function QuestionSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      const q = query.trim();
      if (!q) {
        setRows([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/portal/questions/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Search failed");
        setRows(json.data || []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Search failed");
        }
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [query]);

  const summary = useMemo(() => {
    if (!query.trim()) return "Type to search question text or variable.";
    if (loading) return "Searching…";
    if (error) return error;
    return rows.length ? `${rows.length} result${rows.length === 1 ? "" : "s"}` : "No matches found.";
  }, [query, loading, error, rows.length]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-semibold text-gray-800" htmlFor="question-search">
          Search questions
        </label>
        <p className="text-xs text-gray-500">{summary}</p>
      </div>
      <input
        id="question-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., recycle, climate, packaging, db_column"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Variable</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Question</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row) => (
              <tr key={row.db_column}>
                <td className="px-3 py-2 font-mono text-xs text-gray-800">{row.db_column}</td>
                <td className="px-3 py-2 text-gray-800">{row.question_text}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={2} className="px-3 py-4 text-center text-sm text-gray-500">
                  {query.trim() ? "No matches yet." : "Start typing to see results."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
