"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Lightweight, client-side filter bar.
 * You can wire this to server data later; for now it just emits a custom event
 * the grid listens to (`reports:filters`).
 */
export default function ReportsFilters() {
  const r = useReducedMotion();
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>("All");
  const [topic, setTopic] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [sort, setSort] = useState<string>("Newest");

  const years = useMemo(() => ["All", "2025", "2024", "2023", "2019–2022"], []);
  const topics = useMemo(
    () => ["All", "Gen Z", "Millennials", "Packaging & Claims", "Category: Food & Bev", "Category: Apparel/Beauty", "Sustainability Attitudes"],
    []
  );
  const types = useMemo(() => ["All", "Full Report", "Brief/One-Pager", "Infographic"], []);

  function emit() {
    window.dispatchEvent(
      new CustomEvent("reports:filters", {
        detail: { q, year, topic, type, sort },
      })
    );
  }

  return (
    <section className="relative bg-white" aria-labelledby="reports-filters">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={r ? false : { opacity: 0, y: -8 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
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
                onBlur={emit}
                onKeyDown={(e) => e.key === "Enter" && emit()}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Year */}
            <Select
              label="Year"
              value={year}
              onChange={(v) => { setYear(v); emit(); }}
              options={years}
              className="md:col-span-2"
            />

            {/* Topic */}
            <Select
              label="Topic"
              value={topic}
              onChange={(v) => { setTopic(v); emit(); }}
              options={topics}
              className="md:col-span-3"
            />

            {/* Type */}
            <Select
              label="Type"
              value={type}
              onChange={(v) => { setType(v); emit(); }}
              options={types}
              className="md:col-span-2"
            />

            {/* Sort */}
            <Select
              label="Sort"
              value={sort}
              onChange={(v) => { setSort(v); emit(); }}
              options={["Newest", "A–Z"]}
              className="md:col-span-1"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip label="Gen Z" onClick={() => { setTopic("Gen Z"); emit(); }} />
            <Chip label="Packaging & Claims" onClick={() => { setTopic("Packaging & Claims"); emit(); }} />
            <Chip label="Food & Bev" onClick={() => { setTopic("Category: Food & Bev"); emit(); }} />
            <Chip label="Millennials" onClick={() => { setTopic("Millennials"); emit(); }} />
            <Chip label="Sustainability Attitudes" onClick={() => { setTopic("Sustainability Attitudes"); emit(); }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
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
