"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function DataWeJoin() {
  const r = useReducedMotion();

  const left = {
    title: "Typical client sources",
    items: [
      "Sales/transactional data (SKU/category)",
      "CRM/loyalty & lifecycle markers",
      "Web/app analytics (aggregated)",
      "Geographic/retail coverage & distribution",
    ],
    icon: "ri-database-2-line",
  };

  const right = {
    title: "EcoFocus variables",
    items: [
      "Values & priorities (purpose signals)",
      "Claims & packaging language resonance",
      "Say–do gap (attitudes vs. behaviors)",
      "Price, access, authenticity barriers",
    ],
    icon: "ri-equalizer-line",
  };

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="data-we-join">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="data-we-join"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What we <span className="text-amber-500">merge</span>
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[left, right].map((col, i) => (
            <motion.div
              key={col.title}
              initial={r ? false : { opacity: 0, y: 12 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${col.icon} text-xl text-emerald-600`} />
                <h3 className="text-base font-semibold text-gray-900">{col.title}</h3>
              </div>
              <ul role="list" className="mt-2 space-y-2.5 text-sm text-gray-700">
                {col.items.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-gray-600">
          We support hashed IDs and aggregated joins. PII is not required for most integrations.
        </p>
      </div>
    </section>
  );
}
