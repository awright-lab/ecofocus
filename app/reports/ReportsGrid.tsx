// app/reports/ReportsGrid.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useReportSearchParams } from "./useReportSearchParams";
import type { ReportListItem } from "@/lib/reports-repo";

type ApiResp = { items: ReportListItem[]; nextCursor?: string | null; total?: number };

export default function ReportsGrid() {
  const { values } = useReportSearchParams();
  const [data, setData] = React.useState<ApiResp | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Build canonical query (no cursor yet)
  const qs = React.useMemo(() => {
    const p = new URLSearchParams();
    if (values.q) p.set("q", values.q);
    if (values.year && values.year !== "All") p.set("year", String(values.year));
    if (values.topic && values.topic !== "All") p.set("topic", values.topic);
    if (values.type && values.type !== "All") p.set("type", values.type);
    if (values.access && values.access !== "All") p.set("access", values.access.toLowerCase());
    p.set("sort", values.sort || "Newest");
    p.set("limit", String(values.limit || 24));
    return p.toString();
  }, [values]);

  React.useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/reports?${qs}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((j: ApiResp) => {
        if (!alive) return;
        setData(j);
      })
      .catch((e) => {
        if (!alive) return;
        if (e?.name !== "AbortError") setError("Failed to load reports.");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [qs]);

  const total = data?.total ?? 0;

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

      {/* Pagination hook-up can be added later; keeping UI simple for now */}
    </div>
  );
}

function ReportCard({ item }: { item: ReportListItem }) {
  const isFree = item.access === "Free" || Number(item.price) === 0;
  const href = `/reports/${item.id}`;

  return (
    <div
      className={[
        "group relative rounded-2xl border bg-white shadow-sm transition",
        "border-emerald-200 hover:border-emerald-300 hover:shadow-md",
      ].join(" ")}
    >
      {/* right price/cta */}
      <div className="absolute right-4 top-4 flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-emerald-800/70">
            {isFree ? "No cost" : "Excl. tax"}
          </div>
          {!isFree && (
            <div className="text-lg font-bold text-emerald-900">
              ${Number(item.price).toLocaleString()}
            </div>
          )}
        </div>
        {isFree ? (
          <a
            href={item.freeHref || "#"}
            className="btn-primary-emerald !py-2 !px-4 rounded-xl"
          >
            Download
          </a>
        ) : (
          <Link href={href} className="btn-primary-emerald !py-2 !px-4 rounded-xl">
            Add to cart
          </Link>
        )}
      </div>

      {/* body */}
      <div className="p-5 sm:p-6 pr-40">
        {/* badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-900 ring-1 ring-amber-200">
            {item.year}
          </span>
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-emerald-600 text-white">
            {item.access}
          </span>
        </div>

        {/* title */}
        <h3 className="mt-2 text-[clamp(1.0rem,2.4vw,1.125rem)] font-semibold text-emerald-950 leading-snug">
          <Link href={href} className="hover:underline decoration-amber-400 underline-offset-4">
            {item.title}
          </Link>
        </h3>

        {/* description */}
        {item.description && (
          <p className="mt-2 text-sm text-emerald-900/80 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* tags */}
        {(item.tags?.length ?? 0) > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags!.slice(0, 6).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs text-emerald-900 ring-1 ring-emerald-200"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* secondary CTA */}
        <div className="mt-4">
          <Link
            href={href}
            className="inline-flex items-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-1/3 bg-emerald-100 rounded" />
          <div className="mt-3 h-4 w-2/3 bg-emerald-100 rounded" />
          <div className="mt-2 h-4 w-1/2 bg-emerald-100 rounded" />
        </li>
      ))}
    </ul>
  );
}








