'use client';

import { useEffect, useMemo, useState, type DragEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Question = { db_column: string; question_text: string; topic?: string | null };

type CrosstabCell = {
  row: string;
  col: string;
  count: number;
  rowPct: number;
  colPct: number;
  totalPct: number;
  sig?: "up" | "down" | null;
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

type FilterState = {
  variable: string;
  values: string[];
};

const PIPE_REGEX = /\[pipe:\s*([A-Za-z0-9_]+)\]/g;

const isInternalQuestion = (question?: Question | null) => {
  if (!question) return false;
  const column = question.db_column.toLowerCase();
  const text = question.question_text.toLowerCase();
  if (column.includes("hidden")) return true;
  if (text.includes("assign randomly")) return true;
  return false;
};

const formatQuestionText = (text: string, questionMap: Map<string, Question>) => {
  return text.replace(PIPE_REGEX, (_, token) => {
    const ref = questionMap.get(String(token).toLowerCase());
    if (!ref || isInternalQuestion(ref)) return "assigned topic";
    return ref.question_text.split("\n")[0].trim();
  });
};

export default function CrosstabClient({ questions }: { questions: Question[] }) {
  const [rowVar, setRowVar] = useState("");
  const [colVar, setColVar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CrosstabResult | null>(null);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [filters, setFilters] = useState<FilterState[]>([]);
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});
  const [filterLoading, setFilterLoading] = useState<Record<string, boolean>>({});
  const [filterError, setFilterError] = useState<Record<string, string | null>>({});
  const [percentMode, setPercentMode] = useState<"row" | "col" | "total">("row");
  const [showChart, setShowChart] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showInternal, setShowInternal] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const nextRow = searchParams.get("rowVar") || "";
    const nextCol = searchParams.get("colVar") || "";
    setRowVar(nextRow);
    setColVar(nextCol);
  }, [searchParams]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/portal/questions/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Question search failed");
        setSearchResults(json.data || []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setSearchError(err.message || "Question search failed");
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300);

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

  const setRowSelection = (value: string) => {
    setRowVar(value);
    updateParam("rowVar", value);
  };

  const setColSelection = (value: string) => {
    setColVar(value);
    updateParam("colVar", value);
  };

  const fetchFilterOptions = async (variable: string) => {
    setFilterLoading((prev) => ({ ...prev, [variable]: true }));
    setFilterError((prev) => ({ ...prev, [variable]: null }));
    try {
      const res = await fetch(`/api/portal/questions/values?var=${encodeURIComponent(variable)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load values");
      setFilterOptions((prev) => ({ ...prev, [variable]: json.values || [] }));
    } catch (err: any) {
      setFilterError((prev) => ({ ...prev, [variable]: err.message || "Failed to load values" }));
    } finally {
      setFilterLoading((prev) => ({ ...prev, [variable]: false }));
    }
  };

  const addFilterVar = (variable: string) => {
    setFilters((prev) => {
      if (prev.some((filter) => filter.variable === variable)) return prev;
      return [...prev, { variable, values: [] }];
    });
    if (!filterOptions[variable] && !filterLoading[variable]) {
      void fetchFilterOptions(variable);
    }
  };

  const removeFilterVar = (variable: string) => {
    setFilters((prev) => prev.filter((filter) => filter.variable !== variable));
  };

  const toggleFilterValue = (variable: string, value: string) => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.variable !== variable) return filter;
        const exists = filter.values.includes(value);
        const nextValues = exists
          ? filter.values.filter((item) => item !== value)
          : [...filter.values, value];
        return { ...filter, values: nextValues };
      })
    );
  };

  const handleDrop = (target: "row" | "col" | "filter") => (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const variable = event.dataTransfer.getData("text/plain");
    if (!variable) return;
    if (target === "row") {
      setRowSelection(variable);
    } else if (target === "col") {
      setColSelection(variable);
    } else {
      addFilterVar(variable);
    }
  };

  const onRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const filterPayload = filters.reduce<Record<string, string[]>>((acc, filter) => {
        if (filter.values.length) {
          acc[filter.variable] = filter.values;
        }
        return acc;
      }, {});
      const res = await fetch("/api/portal/crosstabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowVar, colVar, filters: filterPayload }),
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

  const availableVariables = useMemo(() => {
    return query.trim() ? searchResults : questions;
  }, [questions, query, searchResults]);

  const questionMap = useMemo(() => {
    const map = new Map<string, Question>();
    for (const question of [...questions, ...searchResults]) {
      map.set(question.db_column.toLowerCase(), question);
    }
    return map;
  }, [questions, searchResults]);

  const visibleVariables = useMemo(() => {
    if (showInternal) return availableVariables;
    return availableVariables.filter((question) => !isInternalQuestion(question));
  }, [availableVariables, showInternal]);

  const rowKeys = useMemo(() => (result ? Object.keys(result.totals.rowTotals) : []), [result]);
  const colKeys = useMemo(() => (result ? Object.keys(result.totals.colTotals) : []), [result]);
  const cellMap = useMemo(() => {
    const map = new Map<string, CrosstabCell>();
    for (const cell of result?.cells || []) {
      map.set(`${cell.row}|||${cell.col}`, cell);
    }
    return map;
  }, [result]);
  const activeFilterCount = useMemo(
    () => filters.reduce((sum, filter) => sum + filter.values.length, 0),
    [filters]
  );

  const rowInfo = questionMap.get(rowVar.toLowerCase());
  const colInfo = questionMap.get(colVar.toLowerCase());

  const getPct = (cell?: CrosstabCell) => {
    if (!cell) return 0;
    if (percentMode === "col") return cell.colPct;
    if (percentMode === "total") return cell.totalPct;
    return cell.rowPct;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr,1.15fr]">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Variables</p>
            <h3 className="text-lg font-semibold text-gray-900">Pick and assign</h3>
            <p className="text-sm text-gray-600">
              Search the library and add variables to Row, Column, or Filters.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800" htmlFor="question-search">
              Find a question
            </label>
            <input
              id="question-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search question text or variable"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchLoading && <p className="text-xs text-gray-500">Searching questions…</p>}
            {!searchLoading && searchError && <p className="text-xs text-red-600">{searchError}</p>}
            {!searchLoading && !searchError && query.trim() && !searchResults.length && (
              <p className="text-xs text-gray-500">No matching questions yet.</p>
            )}
            {!query.trim() && (
              <p className="text-xs text-gray-500">Showing recent questions. Type to search more.</p>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={showInternal}
              onChange={(event) => setShowInternal(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Show internal variables
          </label>

          <div className="max-h-[480px] space-y-2 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2">
            {visibleVariables.map((variable) => (
              <div
                key={variable.db_column}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", variable.db_column);
                }}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">{variable.db_column}</p>
                    <p className="text-sm text-gray-900">
                      {formatQuestionText(variable.question_text, questionMap)}
                    </p>
                    {variable.topic && (
                      <p className="text-xs text-gray-500">Topic: {variable.topic}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setRowSelection(variable.db_column)}
                      className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:border-emerald-300 hover:text-emerald-800"
                    >
                      Row
                    </button>
                    <button
                      type="button"
                      onClick={() => setColSelection(variable.db_column)}
                      className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:border-emerald-300 hover:text-emerald-800"
                    >
                      Column
                    </button>
                    <button
                      type="button"
                      onClick={() => addFilterVar(variable.db_column)}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-gray-300 hover:text-gray-900"
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!availableVariables.length && (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
                No variables to show.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Canvas</p>
            <h3 className="text-lg font-semibold text-gray-900">Build your crosstab</h3>
            <p className="text-sm text-gray-600">Drop variables into each slot.</p>
          </div>

          <div className="space-y-3">
            <div
              onDrop={handleDrop("row")}
              onDragOver={(event) => event.preventDefault()}
              className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-3"
            >
              <p className="text-xs font-semibold text-emerald-700">Row</p>
              {rowVar ? (
                <div className="mt-2 space-y-1 rounded-lg bg-white px-3 py-2 text-sm shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-700">{rowVar}</span>
                    <button
                      type="button"
                      onClick={() => setRowSelection("")}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  {rowInfo && (
                    <p className="text-xs text-gray-600">
                      {formatQuestionText(rowInfo.question_text, questionMap)}
                      {isInternalQuestion(rowInfo) && " (internal)"}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-600">Drop a variable here.</p>
              )}
            </div>

            <div
              onDrop={handleDrop("col")}
              onDragOver={(event) => event.preventDefault()}
              className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-3"
            >
              <p className="text-xs font-semibold text-emerald-700">Column</p>
              {colVar ? (
                <div className="mt-2 space-y-1 rounded-lg bg-white px-3 py-2 text-sm shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-700">{colVar}</span>
                    <button
                      type="button"
                      onClick={() => setColSelection("")}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  {colInfo && (
                    <p className="text-xs text-gray-600">
                      {formatQuestionText(colInfo.question_text, questionMap)}
                      {isInternalQuestion(colInfo) && " (internal)"}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-600">Drop a variable here.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500">Filters</p>
                <p className="text-sm text-gray-700">
                  {filters.length ? `${filters.length} variables selected` : "No filters applied"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen((prev) => !prev)}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-gray-300"
              >
                {filtersOpen ? "Close filters" : `Open filters${activeFilterCount ? ` (${activeFilterCount})` : ""}`}
              </button>
            </div>
            <div
              onDrop={handleDrop("filter")}
              onDragOver={(event) => event.preventDefault()}
              className="mt-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-600"
            >
              Drop variables here to filter.
            </div>
              {filters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <span
                    key={filter.variable}
                    title={questionMap.get(filter.variable.toLowerCase())?.question_text || ""}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                  >
                    {filter.variable}
                    <button
                      type="button"
                      onClick={() => removeFilterVar(filter.variable)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {filtersOpen && (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-600">Filter values</p>
                  <p className="text-sm text-gray-600">Choose which values to include.</p>
                </div>
              </div>
              {filters.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  Drop a variable above to add a filter.
                </div>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {filters.map((filter) => {
                  const values = filterOptions[filter.variable] || [];
                  const shown = values.slice(0, 40);
                  const hasMore = values.length > 40;
                  return (
                    <div key={filter.variable} className="rounded-xl border border-gray-200 bg-white p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-500">{filter.variable}</p>
                          <p className="text-sm text-gray-800">Select values to include</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFilterVar(filter.variable)}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                      {filterLoading[filter.variable] && (
                        <p className="mt-2 text-xs text-gray-500">Loading values…</p>
                      )}
                      {!filterLoading[filter.variable] && filterError[filter.variable] && (
                        <p className="mt-2 text-xs text-red-600">{filterError[filter.variable]}</p>
                      )}
                      {!filterLoading[filter.variable] && !filterError[filter.variable] && (
                        <div className="mt-2 max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-2 text-xs text-gray-700">
                          {shown.map((value) => (
                            <label key={value} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={filter.values.includes(value)}
                                onChange={() => toggleFilterValue(filter.variable, value)}
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                          {!shown.length && <p className="text-xs text-gray-500">No values found.</p>}
                          {hasMore && (
                            <p className="text-xs text-gray-500">Showing first 40 values.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 p-3">
                <p className="text-xs font-semibold text-gray-600">Weighting</p>
                <p className="text-sm text-gray-600">
                  Weighting is not configured for this dataset yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Percent view</span>
          {(["row", "col", "total"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPercentMode(mode)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                percentMode === mode
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {mode === "row" ? "Row %" : mode === "col" ? "Column %" : "Total %"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowChart((prev) => !prev)}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-gray-300"
          >
            {showChart ? "Table view" : "Chart view"}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Base N: {result.totals.overall.toLocaleString()}</p>
          {result.totals.overall === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
              No results match these variables and filters.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {showChart ? (
                <div className="space-y-3 bg-white p-4">
                  {rowKeys.map((row) => (
                    <div key={row} className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">{row}</div>
                      <div className="flex h-4 overflow-hidden rounded-full bg-gray-100">
                        {colKeys.map((col, index) => {
                          const cell = cellMap.get(`${row}|||${col}`);
                          const pct = getPct(cell);
                          const colors = ["#10b981", "#0ea5e9", "#f97316", "#a855f7", "#14b8a6", "#f43f5e"];
                          return (
                            <div
                              key={`${row}-${col}`}
                              title={`${col}: ${(pct * 100).toFixed(1)}%`}
                              style={{
                                width: `${Math.max(0, pct) * 100}%`,
                                backgroundColor: colors[index % colors.length],
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">{result.rowVar} \\ {result.colVar}</th>
                      {colKeys.map((col) => (
                        <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700">{col}</th>
                      ))}
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {rowKeys.map((row) => (
                      <tr key={row}>
                        <th className="px-3 py-2 text-left font-semibold text-gray-800">{row}</th>
                        {colKeys.map((col) => {
                          const cell = cellMap.get(`${row}|||${col}`);
                          const count = cell?.count || 0;
                          const pct = getPct(cell);
                          const showSig = percentMode === "col" && cell?.sig;
                          return (
                            <td key={`${row}-${col}`} className="px-3 py-2 text-gray-800">
                              <div className="flex flex-col">
                                <span>{count.toLocaleString()}</span>
                                <span className="text-xs text-gray-500">
                                  {(pct * 100).toFixed(1)}%
                                  {showSig === "up" && <span className="ml-1 text-emerald-600">↑</span>}
                                  {showSig === "down" && <span className="ml-1 text-rose-600">↓</span>}
                                </span>
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
              )}
            </div>
          )}
          {percentMode === "col" && (
            <p className="text-xs text-gray-500">
              Column % significance vs overall distribution: ↑ above, ↓ below (95% confidence).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
