"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ExportsAndTheming() {
  const reduceMotion = useReducedMotion();

  const rows = [
    {
      title: "White-label visuals",
      body:
        "Export PNG charts with neutral or brand-safe theming. Perfect for POVs, decks, and approvals.",
      icon: "ri-image-line",
    },
    {
      title: "Analyst-ready data",
      body:
        "CSV downloads with code frames and value labels. Include base sizes and notes for interpretation.",
      icon: "ri-file-excel-2-line",
    },
    {
      title: "Saved view bundles",
      body:
        "Package a set of filters/segments and the charts you need—re-export in seconds next week.",
      icon: "ri-archive-line",
    },
    {
      title: "Brand touches",
      body:
        "Optional logo in chart footers and marigold accent chips to match agency colorways.",
      icon: "ri-palette-line",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="exports-theming">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="exports-theming"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Exports & Theming (How Work Leaves The <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">Tool</span>)
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {rows.map((r, i) => (
            <motion.div
              key={r.title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${r.icon} text-xl text-emerald-600`} />
                <h3 className="text-base font-semibold text-gray-900">{r.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
