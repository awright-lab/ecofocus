// app/reports/ReportsGrid.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useReportSearchParams } from "./useReportSearchParams";
import type { ReportListItem } from "@/lib/reports-repo";

type ApiResp = { items: ReportListItem[]; nextCursor?: string | null; total?: number };

export default function ReportsGrid() {
  const { values, setParam } = useReportSearchParams();
  const [data, setData] = React.useState<ApiResp | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const qs = React.useMemo(() => {
    const p = new URLSearchParams();
    if (values.q) p.set("q", values.q);
    if (values.year && values.year !== "All") p.set("year", String(values.year));
    if (values.topic && values.topic !== "All") p.set("topic", values.topic);
    if (values.type && values.type !== "All") p.set("type", values.type);
    if (values.access && values.access !== "All") p.set("access", values.access.toLowerCase());
    p.set("sort", values.sort || "Newest");
    p.set("limit", String(values.limit || 24));
    if (values.page > 1) p.set("page", String(values.page));
    return p.toString();
  }, [values]);

  React.useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/reports?${qs}`, { signal: ctrl.signal, cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Reports request failed");
        return r.json();
      })
      .then((j: ApiResp) => alive && setData(j))
      .catch((e) => {
        if (alive && e?.name !== "AbortError") setError("Failed to load reports.");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [qs]);

  const total = data?.total ?? 0;
  const limit = values.limit || 24;
  const page = values.page || 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-emerald-900">
          <span className="font-semibold">Reports</span>{" "}
          <span className="text-emerald-800/80">
            — Showing {data?.items?.length ?? 0} of {total}
          </span>
        </p>
      </div>
      <div className="soft-divider mb-6" />

      {/* States */}
      {loading && <ListSkeleton />}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {!loading && !error && (data?.items?.length ?? 0) === 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center">
          <p className="text-emerald-900 font-medium">No results match your filters.</p>
          <p className="text-emerald-900/70 text-sm mt-1">Try clearing a filter or two.</p>
        </div>
      )}

      {/* List */}
      <ul className="space-y-4">
        {data?.items?.map((r) => (
          <li key={r.id}>
            <ReportCard item={r} />
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-2">
          <PagBtn disabled={page <= 1} onClick={() => setParam("page", page - 1)} label="Prev" />
          <PageNumbers page={page} totalPages={totalPages} onSelect={(p) => setParam("page", p)} />
          <PagBtn
            disabled={page >= totalPages}
            onClick={() => setParam("page", page + 1)}
            label="Next"
          />
        </nav>
      )}
    </div>
  );
}

function PagBtn({
  disabled,
  onClick,
  label,
}: {
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-xl border px-3 py-2 text-sm font-medium",
        disabled
          ? "border-emerald-100 text-emerald-400 cursor-not-allowed"
          : "border-emerald-200 text-emerald-900 hover:bg-emerald-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function PageNumbers({
  page,
  totalPages,
  onSelect,
}: {
  page: number;
  totalPages: number;
  onSelect: (p: number) => void;
}) {
  const nums = compactRange(page, totalPages);
  return (
    <>
      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} className="px-2 text-emerald-700/70">
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onSelect(n)}
            aria-current={n === page ? "page" : undefined}
            className={[
              "rounded-xl px-3 py-2 text-sm font-semibold",
              n === page ? "bg-emerald-700 text-white shadow" : "text-emerald-900 hover:bg-emerald-50",
            ].join(" ")}
          >
            {n}
          </button>
        )
      )}
    </>
  );
}

// 1 … 4 5 [6] 7 8 … 20
function compactRange(page: number, total: number) {
  const res: (number | "…")[] = [];
  const add = (n: number | "…") => res.push(n);
  const window = 1;
  for (let i = 1; i <= total; i++) {
    const near = i === 1 || i === total || (i >= page - window && i <= page + window);
    if (near) add(i);
    else if (res[res.length - 1] !== "…") add("…");
  }
  return res;
}

function ReportCard({ item }: { item: ReportListItem }) {
  const isFree = item.access === "Free";
  const href = `/reports/${encodeURIComponent(item.slug)}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      <div className="h-1 bg-gradient-to-r from-emerald-700 via-emerald-500 to-[#EF9601]" />
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-900">{item.year}</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">{isFree ? "Free report" : "Research report"}</span>
            {item.format && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{item.format}</span>}
          </div>
          <h3 className="mt-4 text-xl font-bold leading-snug text-emerald-900">
            <Link href={href} className="hover:underline underline-offset-4">{item.title}</Link>
          </h3>
          {item.description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{item.description}</p>}
          {!!item.tags?.length && <p className="mt-4 text-xs text-slate-500">{item.tags.slice(0, 6).join(" · ")}</p>}
        </div>
        <div className="shrink-0 sm:w-40 sm:text-right">
          <p className="text-xl font-bold text-slate-900">{isFree ? "Free" : item.price > 0 ? `$${item.price.toLocaleString()}` : "Contact us"}</p>
          <Link href={href} className="mt-4 inline-flex justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
            {isFree ? "View download" : "View report"}
          </Link>
        </div>
      </div>
    </article>
  );
}

function ListSkeleton() {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="rounded-2xl section-slab-deep border border-white/10 p-6 shadow-sm">
          <div className="h-5 w-1/3 bg-white/15 rounded" />
          <div className="mt-3 h-4 w-2/3 bg-white/15 rounded" />
          <div className="mt-2 h-4 w-1/2 bg-white/15 rounded" />
        </li>
      ))}
    </ul>
  );
}









