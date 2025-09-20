"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SolutionsComparison() {
  const reduceMotion = useReducedMotion();

  const cols = ["Syndicated Study", "Data Integration", "Custom Studies"] as const;

  const rows: { label: string; values: string[] }[] = [
    {
      label: "Best for",
      values: [
        "Trendlines & defendable evidence",
        "Joining EcoFocus with client/BI data",
        "Answering a specific decision with bespoke evidence",
      ],
    },
    {
      label: "Typical outputs",
      values: [
        "Executive deck, dashboard seats, crosstabs",
        "Merged datasets, schemas, optional dashboard views",
        "Report + appendix; raw data as scoped",
      ],
    },
    {
      label: "Speed to value",
      values: ["Weeks", "1–3 weeks", "2–8 weeks (scope-dependent)"],
    },
    {
      label: "Audience depth",
      values: [
        "n≈4,000/wave; segmentable (incl. Gen Z/Millennial cuts)",
        "Depends on client data + EcoFocus joins",
        "As designed (qual + quant)",
      ],
    },
    {
      label: "Dashboard access",
      values: [
        "Included seats (agency license) + white-label charts",
        "Optional dashboard module; otherwise dataset/API",
        "Optional dashboard module; default executive deck",
      ],
    },
    {
      label: "When it’s ideal",
      values: [
        "You need credible stats & trends to anchor a pitch/POV",
        "You need client-specific personas/validation",
        "You must prove or optimize a high-stakes decision",
      ],
    },
    {
      label: "Not great for",
      values: [
        "One-off niche questions only",
        "Exploration without any client data",
        "Immediate answers today",
      ],
    },
  ];

  const badges = ["Most-used", "Most versatile", "Deepest"] as const;

  return (
    <section id="compare" className="relative bg-brand-tint-blue" aria-labelledby="compare-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="compare-title"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Compare Our Solutions
        </motion.h2>

        {/* Desktop/tablet (md+) — true table with strong row/col separators */}
        <div className="mt-6 hidden md:block rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="divide-x divide-gray-200 bg-gray-50 text-gray-900">
                <th className="w-[220px] px-4 py-3 text-left font-semibold"> </th>
                {cols.map((c, i) => (
                  <th key={c} className="px-4 py-3 text-left font-semibold">
                    <div className="flex items-center gap-2">
                      <span>{c}</span>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                        {badges[i]}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {rows.map((r, ri) => (
                <tr
                  key={r.label}
                  className={`divide-x divide-gray-200 ${ri % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{r.label}</td>
                  {r.values.map((v, vi) => (
                    <td key={vi} className="px-4 py-3 align-top">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile ( < md ) — stacked cards, no horizontal scroll */}
        <div className="mt-6 space-y-4 md:hidden">
          {cols.map((col, ci) => (
            <div key={col} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">{col}</h3>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                  {badges[ci]}
                </span>
              </div>

              <dl className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <div key={r.label} className="grid grid-cols-3 gap-3 py-2">
                    <dt className="col-span-1 text-xs font-medium text-gray-500">{r.label}</dt>
                    <dd className="col-span-2 text-sm text-gray-700">{r.values[ci]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-gray-500">
          MoE shown for national totals; segment margins vary by base size. Secure data handling available under DPA.
        </p>
      </div>
    </section>
  );
}




