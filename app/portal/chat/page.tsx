"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type ChartCell = {
  row: string;
  col: string;
  count: number;
  colPct?: number;
};

type ChartData = {
  rowVar: string;
  colVar: string;
  rowQuestion?: string;
  colQuestion?: string;
  rows: string[];
  cols: string[];
  cells: ChartCell[];
  base: number;
};

type SearchResult = {
  db_column?: string;
  question_code?: string;
  question_text?: string;
  source_header?: string;
  topic?: string;
  display_text?: string;
};

type SearchGroups = {
  questions: SearchResult[];
  related: SearchResult[];
  technical: SearchResult[];
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  chart?: ChartData | null;
  groups?: SearchGroups | null;
};

export default function PortalChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me to find questions or run a crosstab. Examples: \"find questions about packaging chemicals\" or \"run q20br13 by age_group\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/portal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });
      const data = await res.json();
      const reply =
        res.ok && data?.message
          ? String(data.message)
          : String(data?.error || "Something went wrong. Please try again.");
      const chart = data?.chart || null;
      const groups = data?.groups || null;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, chart, groups },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Private
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">Portal Chat</h2>
          <p className="text-sm text-gray-600">
            Ask about 2025 questions or run quick crosstabs.
          </p>
        </div>
      </div>

      <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4">
        {messages.map((msg, idx) => (
          <div
            key={`${msg.role}-${idx}`}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              msg.role === "user"
                ? "self-end bg-emerald-600 text-white"
                : "self-start bg-gray-100 text-gray-800"
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
            {msg.role === "assistant" && msg.chart ? (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700">
                <ChartBlock chart={msg.chart} />
              </div>
            ) : null}
            {msg.role === "assistant" && msg.groups ? (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700">
                <SearchResults groups={msg.groups} />
              </div>
            ) : null}
          </div>
        ))}
        {loading ? (
          <div className="self-start rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
            Thinking...
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about a question or run a crosstab..."
          className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function ChartBlock({ chart }: { chart: ChartData }) {
  const palette = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
    "#6366f1",
    "#f97316",
  ];

  const cellMap = new Map<string, ChartCell>();
  const colTotals = new Map<string, number>();

  for (const cell of chart.cells) {
    cellMap.set(`${cell.row}|||${cell.col}`, cell);
    colTotals.set(cell.col, (colTotals.get(cell.col) || 0) + cell.count);
  }

  const sortedRows = [...chart.rows].sort((a, b) => {
    const aNum = Number(a);
    const bNum = Number(b);
    const aValid = Number.isFinite(aNum);
    const bValid = Number.isFinite(bNum);
    if (aValid && bValid) return aNum - bNum;
    if (aValid) return -1;
    if (bValid) return 1;
    return a.localeCompare(b);
  });

  if (!chart.cols.length || !chart.rows.length) {
    return <div>No chart data available.</div>;
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
          Crosstab chart
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {chart.rowVar} by {chart.colVar}
        </div>
        {chart.base ? (
          <div className="text-xs text-gray-500">Base n: {chart.base}</div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        {sortedRows.map((row, idx) => (
          <div key={`${row}-${idx}`} className="flex items-center gap-2 text-[11px] text-gray-600">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: palette[idx % palette.length] }}
            />
            <span>{row}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {chart.cols.map((col, colIdx) => (
          <div key={`${col}-${colIdx}`} className="space-y-1">
            <div className="text-xs font-semibold text-gray-700">{col}</div>
            <div className="flex h-7 w-full overflow-hidden rounded-full bg-gray-100">
              {sortedRows.map((row, rowIdx) => {
                const cell = cellMap.get(`${row}|||${col}`);
                const total = colTotals.get(col) || 0;
                const pct =
                  cell?.colPct != null
                    ? cell.colPct
                    : total
                    ? (cell?.count || 0) / total
                    : 0;
                const widthPct = Math.max(0, Math.round(pct * 1000) / 10);
                if (!widthPct) return null;
                return (
                  <div
                    key={`${row}-${col}-${rowIdx}`}
                    className="relative flex items-center justify-center text-[10px] font-semibold text-white"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: palette[rowIdx % palette.length],
                    }}
                    title={`${row}: ${widthPct}% (${cell?.count || 0})`}
                  >
                    {widthPct >= 8 ? `${widthPct}%` : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchResults({ groups }: { groups: SearchGroups }) {
  const [showRelated, setShowRelated] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  const renderItem = (item: SearchResult) => {
    const title =
      item.display_text ||
      item.question_text ||
      item.source_header ||
      item.question_code ||
      item.db_column ||
      "Untitled";
    const meta = [item.question_code, item.topic].filter(Boolean).join(" • ");
    return (
      <div key={`${item.db_column || item.question_code}-${title}`} className="rounded-lg border border-gray-100 bg-white p-2">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-[11px] text-gray-500">{meta}</div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Survey questions
        </div>
        <div className="mt-2 space-y-2">
          {(groups.questions || []).slice(0, 8).map(renderItem)}
          {!groups.questions?.length ? (
            <div className="text-xs text-gray-500">No survey questions found.</div>
          ) : null}
        </div>
      </div>

      {groups.related?.length ? (
        <div>
          <button
            type="button"
            onClick={() => setShowRelated((prev) => !prev)}
            className="text-xs font-semibold text-emerald-700"
          >
            {showRelated ? "Hide related results" : "Show related results"}
          </button>
          {showRelated ? (
            <div className="mt-2 space-y-2">
              {groups.related.slice(0, 8).map(renderItem)}
            </div>
          ) : null}
        </div>
      ) : null}

      {groups.technical?.length ? (
        <div>
          <button
            type="button"
            onClick={() => setShowTechnical((prev) => !prev)}
            className="text-xs font-semibold text-gray-500"
          >
            {showTechnical ? "Hide advanced" : "Advanced"}
          </button>
          {showTechnical ? (
            <div className="mt-2 space-y-2">
              {groups.technical.slice(0, 8).map(renderItem)}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
