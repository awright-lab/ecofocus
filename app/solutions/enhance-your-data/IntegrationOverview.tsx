"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function IntegrationOverview() {
  const r = useReducedMotion();

  const cards = [
    {
      title: "What it is",
      body:
        "We join EcoFocus sustainability measures to your client data to sharpen personas, sizing, and messaging—without reinventing research.",
      icon: "ri-stack-line",
    },
    {
      title: "Why it matters",
      body:
        "Purpose talk is cheap. Join shows where values drive behavior, where price/access blocks, and where claims can backfire.",
      icon: "ri-lightbulb-flash-line",
    },
    {
      title: "Where it lands",
      body:
        "Analyst-ready datasets, optional dashboard modules, and white-label exports for pitches, POVs, and approvals.",
      icon: "ri-send-plane-2-line",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="int-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="int-overview"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Integration for Agency Outcomes
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={r ? false : { opacity: 0, y: 12 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${c.icon} text-xl text-emerald-600`} />
                <h3 className="text-base font-semibold text-gray-900">{c.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{c.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
