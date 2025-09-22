// app/reports/ReportsGrid.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

/** Match your list API shape */
type Report = {
  id: string;
  slug: string;
  title: string;
  year: number | string;
  price: number;                 // 0 => free
  access: "Free" | "Premium" | string;
  tags?: string[];
  description?: string;
  cover?: string | null;         // optional thumbnail
};

type ApiResponse = {
  items: Report[];
  nextCursor?: string | null;
  total?: number;
};

const PAGE_LIMIT = 12;

export default function ReportsGrid() {
  const sp = useSearchParams();

  // read current filters (keep canonical param names)
  const q = sp.get("q") ?? "";
  const year = sp.get("year") ?? "All";
  const topic = sp.get("topic") ?? "All";
  const type = sp.get("type") ?? "All";
  const access = (sp.get("access") ?? "All") as "All" | "Free" | "Premium";
  const sort = (sp.get("sort") ?? "Newest") as "Newest" | "AtoZ";

  const [items, setItems] = React.useState<Report[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [total, setTotal] = React.useState<number | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);

  // Build base query without cursor
  const baseQuery = React.useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (access !== "All") p.set("access", access.toLowerCase()); // free|premium
    if (year !== "All") p.set("year", year);
    if (topic !== "All") p.set("topic", topic);
    if (type !== "All") p.set("type", type);
    p.set("sort", sort);
    p.set("limit", String(PAGE_LIMIT));
    return p;
  }, [q, access, year, topic, type, sort]);

  // Initial fetch whenever filters change
  React.useEffect(() => {
    let ignore = false;
    setLoading(true);

    const p = new URLSearchParams(baseQuery.toString());
    fetch(`/api/reports?${p.toString()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json: ApiResponse) => {
        if (ignore) return;
        setItems(json.items || []);
        setNextCursor(json.nextCursor ?? null);
        setTotal(json.total);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [baseQuery]);

  async function loadMore() {
    if (!nextCursor) return;
    setLoading(true);
    const p = new URLSearchParams(baseQuery.toString());
    p.set("cursor", nextCursor);
    const res = await fetch(`/api/reports?${p.toString()}`, { cache: "no-store" });
    const json: ApiResponse = await res.json();
    setItems((prev) => prev.concat(json.items || []));
    setNextCursor(json.nextCursor ?? null);
    setLoading(false);
  }

  return (
    <section aria-labelledby="reports-list">
      <h2 id="reports-list" className="sr-only">Reports</h2>

      {/* Top summary + sort (kept simple—hook your Sort here if desired) */}
      <div className="flex items-center justify-between gap-4 pb-3 mb-4 soft-divider">
        <div className="text-sm text-emerald-900">
          <strong>Reports</strong>{" "}
          {loading ? "— Loading…" : `— Showing ${items.length}${typeof total === "number" ? ` of ${total}` : ""}`}
        </div>
      </div>

      {/* LIST with zebra rows */}
      <ul className="divide-y divide-emerald-100 rounded-2xl bg-white overflow-hidden">
        {loading && items.length === 0 && (
          <li className="py-10 text-center text-emerald-700">Loading results…</li>
        )}

        {!loading && items.length === 0 && (
          <li className="py-10 text-center text-emerald-700">No results match your filters.</li>
        )}

        {items.map((report, idx) => (
          <li key={report.id} className={idx % 2 === 1 ? "bg-emerald-50/40" : "bg-white"}>
            <Row report={report} />
          </li>
        ))}
      </ul>

      {/* Load more */}
      {nextCursor && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn-primary-emerald px-5 py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}

/* --------------------- Row UI --------------------- */

function Row({ report }: { report: Report }) {
  const isFree = String(report.access).toLowerCase() === "free" || Number(report.price) === 0;

  return (
    <div className="px-4 sm:px-6 py-5">
      <div className="rounded-2xl bg-emerald-50/40 border border-emerald-100 p-4 sm:p-5 transition-shadow hover:shadow-md">
        <div className="grid grid-cols-12 gap-4 items-start">
          {/* Thumbnail (optional) */}
          <div className="col-span-12 md:col-span-1 hidden sm:block">
            {report.cover ? (
              <Image
                src={report.cover}
                alt=""
                width={80}
                height={112}
                className="h-28 w-20 rounded-md object-cover border border-emerald-100"
              />
            ) : (
              <div className="h-28 w-20 rounded-md bg-emerald-100 border border-emerald-200" />
            )}
          </div>

          {/* Title + meta */}
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={[
                  "inline-flex items-center rounded-full text-[11px] px-2 py-0.5 border",
                  isFree
                    ? "bg-emerald-100 text-emerald-900 border-emerald-200"
                    : "bg-amber-100 text-amber-900 border-amber-200",
                ].join(" ")}
              >
                {isFree ? "Free" : "Premium"}
              </span>
              {report.year && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-900 text-[11px] px-2 py-0.5 border border-emerald-100">
                  {report.year}
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-emerald-950 leading-snug">
              <Link href={`/reports/${report.slug}`} className="hover:underline underline-offset-4">
                {report.title}
              </Link>
            </h3>

            {report.description && (
              <p className="mt-1 text-sm text-emerald-800/90 line-clamp-2">
                {report.description}
              </p>
            )}

            {!!report.tags?.length && (
              <div className="mt-2 flex flex-wrap gap-1">
                {report.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-900"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price + CTAs */}
          <div className="col-span-12 md:col-span-4 md:text-right">
            {isFree ? (
              <div className="text-sm text-emerald-700">No cost</div>
            ) : (
              <>
                <div className="text-xs text-emerald-700">Excl. tax</div>
                <div className="text-2xl font-bold text-emerald-950">
                  ${Number(report.price).toLocaleString()}
                </div>
              </>
            )}

            <div className="mt-3 flex md:justify-end gap-2">
              <Link
                href={`/reports/${report.slug}`}
                className="btn-secondary-light px-3 py-2 rounded-lg"
              >
                View details
              </Link>

              {isFree ? (
                <Link
                  href={`/reports/${report.slug}`}
                  className="btn-primary-emerald px-3 py-2 rounded-lg"
                >
                  Download
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("cart:add", { detail: { id: report.id, slug: report.slug } })
                    )
                  }
                  className="btn-primary-emerald px-3 py-2 rounded-lg"
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





