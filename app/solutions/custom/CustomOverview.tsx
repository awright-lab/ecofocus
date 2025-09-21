"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function CustomOverview() {
  const r = useReducedMotion();

  const cards = [
    {
      title: "What it is",
      body:
        "Decision-first research. We scope to your objective, choose the right methods, and deliver findings you can defend.",
      icon: "ri-compasses-2-line",
    },
    {
      title: "When to use it",
      body:
        "You must prove or optimize a high-stakes move—claims, language, pricing, packaging, concepts, or go-to-market.",
      icon: "ri-flag-2-line",
    },
    {
      title: "Why agencies choose it",
      body:
        "Sharper creative briefs, reduced backlash risk, and executive-ready proof points tied to Gen Z & Millennial behavior.",
      icon: "ri-award-line",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="custom-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="custom-overview"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Custom Studies for High-Stakes Decisions
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
