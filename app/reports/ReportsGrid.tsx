// app/reports/sections/ReportsGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

type Report = {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  date: string;
  year: string;
  type: "Full Report" | "Brief/One-Pager" | "Infographic";
  topic: string;
  wave?: string;
  pages?: number;
  format?: string;
  sampleHref?: string;
  detailHref: string;
  access: "Free" | "Premium";
  freeHref?: string;
  priceId?: string;
  priceDisplay?: string;
};

type Initial = {
  items: Report[];
  nextCursor?: string;
  total: number;
};

export default function ReportsGrid({
  initial,
  query,
}: {
  initial: Initial;
  query: {
    q?: string;
    year?: string;
    topic?: string;
    type?: string;
    access?: "All" | "Free" | "Premium";
    sort?: "Newest" | "A–Z";
    limit?: number;
    cursor?: string;
  };
}) {
  const r = useReducedMotion();
  const sp = useSearchParams();

  const [items, setItems] = useState<Report[]>(initial.items);
  const [cursor, setCursor] = useState<string | undefined>(initial.nextCursor);
  const [total, setTotal] = useState<number>(initial.total);
  const [loading, setLoading] = useState(false);

  const didMount = useRef(false);
  const key = sp.toString();

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    let cancelled = false;

    async function refetch() {
      setLoading(true);
      const url =
        "/api/reports?" +
        new URLSearchParams({
          q: sp.get("q") ?? "",
          year: sp.get("year") ?? "All",
          topic: sp.get("topic") ?? "All",
          type: sp.get("type") ?? "All",
          access: sp.get("access") ?? "All",
          sort: sp.get("sort") ?? "Newest",
          limit: String(query.limit ?? 24),
        }).toString();

      const res = await fetch(url, { cache: "no-store" });
      const data = (await res.json()) as Initial;
      if (cancelled) return;

      setItems(data.items);
      setCursor(data.nextCursor);
      setTotal(data.total);
      setLoading(false);
    }

    refetch();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function loadMore() {
    if (!cursor || loading) return;
    setLoading(true);

    const url =
      "/api/reports?" +
      new URLSearchParams({
        q: sp.get("q") ?? "",
        year: sp.get("year") ?? "All",
        topic: sp.get("topic") ?? "All",
        type: sp.get("type") ?? "All",
        access: sp.get("access") ?? "All",
        sort: sp.get("sort") ?? "Newest",
        limit: String(query.limit ?? 24),
        cursor,
      }).toString();

    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as Initial;

    setItems((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setTotal(data.total);
    setLoading(false);
  }

  const shown = items.length;
  const empty = shown === 0 && !loading;

  return (
    <section className="relative bg-white" aria-labelledby="reports-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-12 sm:pb-14 md:pb-16">
        <motion.h2
          id="reports-grid"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Latest reports & briefs
        </motion.h2>

        <p className="mt-2 text-center text-xs text-gray-600">
          Showing {shown} of {total}
          {cursor ? "+" : ""} results
        </p>

        {!empty ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((rep, i) => (
              <motion.article
                key={rep.id}
                initial={r ? false : { opacity: 0, y: 12 }}
                whileInView={r ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 12) * 0.02 }}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg"
              >
                {/* image + badges */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                  <Image
                    src={rep.cover}
                    alt={`${rep.title} cover`}
                    fill
                    className="object-contain"
                    sizes="(min-width:1280px) 22vw, (min-width:1024px) 28vw, (min-width:640px) 45vw, 92vw"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-gray-900/80 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                    {rep.type}
                  </span>
                  {rep.access === "Free" ? (
                    <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow">
                      Free
                    </span>
                  ) : (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-900 ring-1 ring-gray-200 shadow">
                      <i className="ri-lock-2-line text-[12px] opacity-70" aria-hidden />
                      {rep.priceDisplay ?? "Premium"}
                    </span>
                  )}
                </div>

                {/* meta */}
                <div className="mt-3 flex-1">
                  <h3 className="text-sm font-semibold leading-snug text-gray-900">{rep.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    {rep.wave && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{rep.wave}</span>}
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{rep.topic}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{rep.year}</span>
                    {rep.pages ? <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{rep.pages} pp</span> : null}
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href={rep.detailHref}
                    className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-all duration-300
                               before:content-[''] before:absolute before:inset-0 before:rounded-full
                               before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                               before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                  >
                    <span className="relative z-10">View details</span>
                  </Link>
                  {rep.access === "Free" && rep.freeHref ? (
                    <a
                      href={rep.freeHref}
                      className="relative inline-flex items-center justify-center rounded-full bg-[#FFC107] px-3 py-2 text-xs font-semibold text-emerald-950 transition-all duration-300
                                 before:content-[''] before:absolute before:inset-0 before:rounded-full
                                 before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                                 before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                    >
                      <span className="relative z-10">Download free</span>
                    </a>
                  ) : rep.sampleHref ? (
                    <a
                      href={rep.sampleHref}
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Sample
                    </a>
                  ) : <span />}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-sm text-gray-600">
            No reports match your filters. Try clearing one or more filters.
          </div>
        )}

        {cursor && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300
                         before:content-[''] before:absolute before:inset-0 before:rounded-full
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



