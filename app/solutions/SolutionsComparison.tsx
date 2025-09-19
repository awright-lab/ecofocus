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
    <section id="compare" className="relative bg-white" aria-labelledby="compare-title">
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

        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-[780px] w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-900">
                <th className="px-4 py-3 text-left font-semibold"> </th>
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
            <tbody className="text-gray-700">
              {rows.map((r, ri) => (
                <tr key={r.label} className={ri % 2 === 1 ? "bg-gray-50/40" : ""}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{r.label}</td>
                  {r.values.map((v, vi) => (
                    <td key={vi} className="px-4 py-3 align-top">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-center text-xs text-gray-500">
          MoE shown for national totals; segment margins vary by base size. Secure data handling available under DPA.
        </p>
      </div>
    </section>
  );
}



