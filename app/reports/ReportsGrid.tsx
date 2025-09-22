// app/reports/sections/ReportsGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/** Match your existing API shape */
type Report = {
  id: string;
  slug: string;
  title: string;
  year: number | string;
  price: number;                  // 0 for free
  access: "Free" | "Premium" | string;
  tags?: string[];
  description?: string;
  cover?: string;                 // optional thumbnail/cover
};

type ApiResponse = {
  items: Report[];
  nextCursor?: string | null;
  total?: number;
};

const PAGE_LIMIT = 12;

export default function ReportsGrid() {
  const r = useReducedMotion();
  const sp = useSearchParams();

  // read current filters (keep your canonical params)
  const q = sp.get("q") ?? "";
  const year = sp.get("year") ?? "All";
  const topic = sp.get("topic") ?? "All";
  const type = sp.get("type") ?? "All";
  const access = (sp.get("access") ?? "All") as "All" | "Free" | "Premium";
  const sort = (sp.get("sort") ?? "Newest") as "Newest" | "AtoZ";

  const [items, setItems] = useState<Report[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(null);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Build base query (without cursor); mirrors your /api/reports route.ts
  const baseQuery = useMemo(() => {
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
  useEffect(() => {
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
    <section className="relative" aria-labelledby="reports-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* Header row: count + (optional) helper text */}
        <div className="mb-4 flex items-center justify-between">
          <h2 id="reports-grid" className="sr-only">
            Reports
          </h2>
          <p className="text-sm text-emerald-800">
            {loading ? "Loading…" : `Showing ${items.length}${typeof total === "number" ? ` of ${total}` : ""}`}
          </p>
        </div>

        {/* LIST VIEW (replaces card grid): zebra rows + strong dividers */}
        <ul className="divide-y divide-emerald-100 rounded-2xl ring-1 ring-emerald-100 bg-white overflow-hidden">
          {loading && items.length === 0 && (
            <li className="py-10 text-center text-emerald-700">Loading results…</li>
          )}

          {!loading && items.length === 0 && (
            <li className="py-10 text-center text-emerald-700">No results match your filters.</li>
          )}

          {items.map((report, idx) => (
            <motion.li
              key={report.id}
              initial={r ? false : { opacity: 0, y: 6 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
              transition={{ duration: 0.28, delay: (idx % 6) * 0.02 }}
              className={idx % 2 === 1 ? "bg-emerald-50/30" : "bg-white"}
            >
              <ReportRow report={report} />
            </motion.li>
          ))}
        </ul>

        {/* Load more (cursor) */}
        {nextCursor && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="relative inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white
                         bg-emerald-600 hover:bg-emerald-700 transition
                         before:absolute before:inset-0 before:rounded-xl before:opacity-20
                         before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0 disabled:opacity-60"
            >
              <span className="relative z-10">{loading ? "Loading…" : "Load more"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------- Row UI --------------------- */

function ReportRow({ report }: { report: Report }) {
  const isFree = String(report.access).toLowerCase() === "free" || Number(report.price) === 0;

  return (
    <div className="px-4 sm:px-6 py-5">
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Thumbnail (optional) */}
        <div className="col-span-12 md:col-span-1 hidden sm:block">
          {report.cover ? (
            <Image
              src={report.cover}
              alt=""
              width={80}
              height={112}
              className="h-28 w-20 rounded-md object-cover ring-1 ring-emerald-200"
            />
          ) : (
            <div className="h-28 w-20 rounded-md bg-emerald-100 ring-1 ring-emerald-200" />
          )}
        </div>

        {/* Title + meta */}
        <div className="col-span-12 md:col-span-7">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={[
                "inline-flex items-center rounded-full text-[11px] px-2 py-0.5 ring-1",
                isFree
                  ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
                  : "bg-marigold-100 text-marigold-900 ring-marigold-200",
              ].join(" ")}
            >
              {isFree ? "Free" : "Premium"}
            </span>
            {report.year && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 text-[11px] px-2 py-0.5 ring-1 ring-emerald-100">
                {report.year}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-emerald-950 leading-snug">
            <Link href={`/reports/${report.slug}`} className="hover:underline">
              {report.title}
            </Link>
          </h3>

          {report.description && (
            <p className="mt-1 text-sm text-emerald-800/80 line-clamp-2">
              {report.description}
            </p>
          )}

          {!!report.tags?.length && (
            <div className="mt-2 flex flex-wrap gap-1">
              {report.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 ring-1 ring-emerald-100 text-emerald-800"
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
              className="px-3 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 text-emerald-900"
            >
              View details
            </Link>

            {isFree ? (
              <Link
                href={`/reports/${report.slug}`}
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Download
              </Link>
            ) : (
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => {
                  // Hook to your cart/Stripe. This matches your current pattern.
                  window.dispatchEvent(
                    new CustomEvent("cart:add", { detail: { id: report.id, slug: report.slug } })
                  );
                }}
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




