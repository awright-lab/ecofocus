"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

export default function ReportsFilters() {
  const r = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  // Read current params
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [year, setYear] = useState(sp.get("year") ?? "All");
  const [topic, setTopic] = useState(sp.get("topic") ?? "All");
  const [type, setType] = useState(sp.get("type") ?? "All");
  const [sort, setSort] = useState(sp.get("sort") ?? "Newest");

  // Keep local state in sync when nav changes (e.g., back/forward)
  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setYear(sp.get("year") ?? "All");
    setTopic(sp.get("topic") ?? "All");
    setType(sp.get("type") ?? "All");
    setSort(sp.get("sort") ?? "Newest");
  }, [sp]);

  const years = useMemo(() => ["All", "2025", "2024", "2023", "2019–2022"], []);
  const topics = useMemo(
    () => ["All", "Gen Z", "Millennials", "Packaging & Claims", "Category: Food & Bev", "Category: Apparel/Beauty", "Sustainability Attitudes"],
    []
  );
  const types = useMemo(() => ["All", "Full Report", "Brief/One-Pager", "Infographic"], []);

  function push(params: Record<string, string>) {
    const next = new URLSearchParams(sp.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (!v || v === "All" || (k === "q" && v.trim() === "")) next.delete(k);
      else next.set(k, v);
    });
    next.delete("cursor"); // reset pagination when filters change
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    push({ q, year, topic, type, sort });
  }

  return (
    <section className="relative bg-white" aria-labelledby="reports-filters">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <motion.form
          initial={r ? false : { opacity: 0, y: -8 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          onSubmit={onSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Search */}
            <div className="md:col-span-4">
              <label htmlFor="report-search" className="sr-only">Search reports</label>
              <input
                id="report-search"
                type="search"
                placeholder="Search titles, topics…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={onSubmit}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <Select label="Year" value={year} onChange={(v) => { setYear(v); push({ year: v }); }} options={years} className="md:col-span-2" />
            <Select label="Topic" value={topic} onChange={(v) => { setTopic(v); push({ topic: v }); }} options={topics} className="md:col-span-3" />
            <Select label="Type" value={type} onChange={(v) => { setType(v); push({ type: v }); }} options={types} className="md:col-span-2" />
            <Select label="Sort" value={sort} onChange={(v) => { setSort(v); push({ sort: v }); }} options={["Newest", "A–Z"]} className="md:col-span-1" />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip label="Gen Z" onClick={() => { setTopic("Gen Z"); push({ topic: "Gen Z" }); }} />
            <Chip label="Packaging & Claims" onClick={() => { setTopic("Packaging & Claims"); push({ topic: "Packaging & Claims" }); }} />
            <Chip label="Food & Bev" onClick={() => { setTopic("Category: Food & Bev"); push({ topic: "Category: Food & Bev" }); }} />
            <Chip label="Millennials" onClick={() => { setTopic("Millennials"); push({ topic: "Millennials" }); }} />
            <Chip label="Sustainability Attitudes" onClick={() => { setTopic("Sustainability Attitudes"); push({ topic: "Sustainability Attitudes" }); }} />
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function Select({
  label, value, onChange, options, className = "",
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; className?: string;
}) {
  return (
    <div className={className}>
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-emerald-900 hover:bg-amber-100"
    >
      {label}
    </button>
  );
}

