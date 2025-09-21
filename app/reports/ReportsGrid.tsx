"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/**
 * NOTE: Replace `seed` with your real data source.
 * “Integrity of the reports”: we keep the full cover visible via object-contain,
 * fixed 3:4 aspect, soft ring, no cropping.
 */
type Report = {
  slug: string;
  title: string;
  cover: string;
  date: string;   // "2025-06-01"
  year: string;   // "2025"
  type: "Full Report" | "Brief/One-Pager" | "Infographic";
  topic: string;  // "Gen Z", "Packaging & Claims", etc.
  wave?: string;  // "2025 H1"
  pages?: number;
  format?: string; // "PDF"
  sampleHref?: string;
  detailHref?: string;
};

const seed: Report[] = [
  {
    slug: "2025-genz-brand-purpose",
    title: "Gen Z & Brand Purpose: Signals that move behavior (2025 H1)",
    cover: "/images/reports/cover-genz-purpose-2025.jpg",
    date: "2025-06-15",
    year: "2025",
    type: "Full Report",
    topic: "Gen Z",
    wave: "2025 H1",
    pages: 54,
    format: "PDF",
    sampleHref: "/files/reports/2025-genz-purpose-sample.pdf",
    detailHref: "/reports/2025-genz-brand-purpose",
  },
  {
    slug: "2024-claims-packaging",
    title: "Sustainability Claims & Packaging Language (Cross-Gen)",
    cover: "/images/reports/cover-claims-packaging-2024.jpg",
    date: "2024-10-02",
    year: "2024",
    type: "Full Report",
    topic: "Packaging & Claims",
    wave: "2024 H2",
    pages: 46,
    format: "PDF",
    sampleHref: "/files/reports/2024-claims-packaging-sample.pdf",
    detailHref: "/reports/2024-claims-packaging",
  },
  {
    slug: "2025-foodbev-values",
    title: "Category Focus: Food & Beverage Values Map (2025)",
    cover: "/images/reports/cover-foodbev-2025.jpg",
    date: "2025-04-01",
    year: "2025",
    type: "Brief/One-Pager",
    topic: "Category: Food & Bev",
    wave: "2025 H1",
    pages: 8,
    format: "PDF",
    sampleHref: "/files/reports/2025-foodbev-brief-sample.pdf",
    detailHref: "/reports/2025-foodbev-values",
  },
  {
    slug: "2023-sustainability-attitudes",
    title: "Sustainability Attitudes: Say–Do Gap Watchlist",
    cover: "/images/reports/cover-attitudes-2023.jpg",
    date: "2023-09-09",
    year: "2023",
    type: "Infographic",
    topic: "Sustainability Attitudes",
    wave: "2023 H2",
    pages: 2,
    format: "PDF",
    sampleHref: "/files/reports/2023-attitudes-infographic.pdf",
    detailHref: "/reports/2023-say-do-gap",
  },
];

export default function ReportsGrid() {
  const r = useReducedMotion();
  const [filters, setFilters] = useState<{ q: string; year: string; topic: string; type: string; sort: string }>({
    q: "",
    year: "All",
    topic: "All",
    type: "All",
    sort: "Newest",
  });

  useEffect(() => {
    const onFilters = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setFilters(detail);
    };
    window.addEventListener("reports:filters", onFilters);
    return () => window.removeEventListener("reports:filters", onFilters);
  }, []);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    let list = seed.filter((r) => {
      const matchQ = !q || r.title.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q);
      const matchYear = filters.year === "All" || r.year === filters.year || (filters.year === "2019–2022" && ["2019","2020","2021","2022"].includes(r.year));
      const matchTopic = filters.topic === "All" || r.topic === filters.topic;
      const matchType = filters.type === "All" || r.type === filters.type;
      return matchQ && matchYear && matchTopic && matchType;
    });

    if (filters.sort === "Newest") {
      list = list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    } else {
      list = list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [filters]);

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

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((rep, i) => (
            <motion.article
              key={rep.slug}
              initial={r ? false : { opacity: 0, y: 12 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg"
            >
              {/* COVER — keep integrity: 3:4, object-contain, soft ring */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                <Image
                  src={rep.cover}
                  alt={`${rep.title} cover`}
                  fill
                  sizes="(min-width:1280px) 22vw, (min-width:1024px) 28vw, (min-width:640px) 45vw, 92vw"
                  className="object-contain"
                  priority={i < 4}
                />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
                  {rep.type}
                </span>
              </div>

              {/* META */}
              <div className="mt-3 flex-1">
                <h3 className="text-sm font-semibold leading-snug text-gray-900">{rep.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  {rep.wave && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{rep.wave}</span>}
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{rep.topic}</span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{rep.year}</span>
                  {rep.pages ? <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">{rep.pages} pp</span> : null}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {rep.sampleHref ? (
                  <a
                    href={rep.sampleHref}
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Download sample
                  </a>
                ) : (
                  <span />
                )}
                <Link
                  href={rep.detailHref ?? `/reports/${rep.slug}`}
                  className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-all duration-300
                             before:content-[''] before:absolute before:inset-0 before:rounded-full
                             before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                             before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">View details</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-12 text-center text-sm text-gray-600">
            No reports match your filters. Try clearing one or more filters.
          </div>
        )}
      </div>
    </section>
  );
}
