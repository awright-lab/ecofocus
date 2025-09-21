"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function IntegrationWorkflow() {
  const r = useReducedMotion();

  const rows = [
    {
      title: "Scope & keys",
      body:
        "Define the decision, pick variables/segments, confirm join keys or hashed IDs. No PII required for most use cases.",
      icon: "ri-key-2-line",
    },
    {
      title: "Join & QA",
      body:
        "We perform the merge, run balance checks, flag small bases, and document assumptions and code frames.",
      icon: "ri-links-line",
    },
    {
      title: "Reads & views",
      body:
        "Produce saved views, crosstabs, and deltas—optionally surfaced in your Interactive Dashboard module.",
      icon: "ri-bar-chart-2-line",
    },
    {
      title: "Delivery",
      body:
        "Datasets (CSV/Parquet), schemas, and a short readout deck. Secure bucket/API delivery on eligible plans.",
      icon: "ri-send-plane-2-line",
    },
  ];

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="workflow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="workflow"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          How the{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Integration Works
          </span>
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {rows.map((r_, i) => (
            <motion.article
              key={r_.title}
              initial={r ? false : { opacity: 0, y: 12 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${r_.icon} text-xl text-emerald-600`} aria-hidden="true" />
                <h3 className="text-base font-semibold text-gray-900">{r_.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{r_.body}</p>
            </motion.article>
          ))}
        </div>

        <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-gray-600">
          We document variables, joins, and flags in an appendix; small-base reads are clearly marked.
        </p>
      </div>
    </section>
  );
}

