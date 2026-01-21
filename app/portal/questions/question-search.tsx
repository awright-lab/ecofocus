'use client';

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QuestionRow = {
  db_column: string;
  question_text: string;
  topic?: string | null;
};

const DEBOUNCE_MS = 300;
const PIPE_REGEX = /\[pipe:\s*([A-Za-z0-9_]+)\]/g;

const isInternalQuestion = (row?: QuestionRow | null) => {
  if (!row) return false;
  const column = row.db_column.toLowerCase();
  const text = row.question_text.toLowerCase();
  if (column.includes("hidden")) return true;
  if (text.includes("assign randomly")) return true;
  return false;
};

export default function QuestionSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showInternal, setShowInternal] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const rowVarParam = searchParams.get("rowVar") || "";
  const colVarParam = searchParams.get("colVar") || "";

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setRows([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setRows([]);
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
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [query]);

  const updateParam = (key: "rowVar" | "colVar", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const rowMap = useMemo(() => {
    const map = new Map<string, QuestionRow>();
    for (const row of rows) {
      map.set(row.db_column.toLowerCase(), row);
    }
    return map;
  }, [rows]);

  const formatQuestionText = (text: string) => {
    return text.replace(PIPE_REGEX, (_, token) => {
      const ref = rowMap.get(String(token).toLowerCase());
      if (!ref || isInternalQuestion(ref)) return "assigned topic";
      return ref.question_text.split("\n")[0].trim();
    });
  };

  const visibleRows = useMemo(() => {
    if (showInternal) return rows;
    return rows.filter((row) => !isInternalQuestion(row));
  }, [rows, showInternal]);

  const summary = useMemo(() => {
    if (!query.trim()) return "Type to search question text or variable.";
    if (loading) return "Searching…";
    if (error) return error;
    if (!visibleRows.length) return "No matches found.";
    const hiddenCount = rows.length - visibleRows.length;
    if (hiddenCount > 0 && !showInternal) {
      return `${visibleRows.length} result${visibleRows.length === 1 ? "" : "s"} (${hiddenCount} hidden)`;
    }
    return `${visibleRows.length} result${visibleRows.length === 1 ? "" : "s"}`;
  }, [query, loading, error, rows.length, showInternal, visibleRows.length]);

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
      <label className="flex items-center gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={showInternal}
          onChange={(event) => setShowInternal(event.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        Show internal variables
      </label>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Variable</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Question</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Topic</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {visibleRows.map((row) => {
              const isRow = rowVarParam === row.db_column;
              const isCol = colVarParam === row.db_column;
              return (
                <tr key={row.db_column}>
                  <td className="px-3 py-2 font-mono text-xs text-gray-800">{row.db_column}</td>
                  <td className="px-3 py-2 text-gray-800">{formatQuestionText(row.question_text)}</td>
                  <td className="px-3 py-2 text-gray-700">{row.topic || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateParam("rowVar", row.db_column)}
                        className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:border-emerald-300 hover:text-emerald-800"
                        aria-pressed={isRow}
                      >
                        {isRow ? "Row selected" : "Use as Row"}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateParam("colVar", row.db_column)}
                        className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:border-emerald-300 hover:text-emerald-800"
                        aria-pressed={isCol}
                      >
                        {isCol ? "Column selected" : "Use as Column"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {loading && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-sm text-gray-500">
                  Loading results…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && !rows.length && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-sm text-gray-500">
                  {query.trim() ? "No matches yet." : "Start typing to see results."}
                </td>
              </tr>
            )}
            {!loading && !error && rows.length > 0 && !visibleRows.length && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-sm text-gray-500">
                  All matches are hidden internal variables. Toggle "Show internal variables" to view them.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
