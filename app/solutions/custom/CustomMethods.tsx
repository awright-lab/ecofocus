"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function CustomMethods() {
  const r = useReducedMotion();

  const cols = [
    {
      title: "Qualitative",
      icon: "ri-mic-line",
      items: [
        "1:1 depth interviews & mini-groups",
        "Digital diaries & ethnography",
        "Creative language + narrative testing",
        "Co-creation with Gen Z & Millennials",
      ],
    },
    {
      title: "Quantitative",
      icon: "ri-bar-chart-2-line",
      items: [
        "Concept/claims testing (monadic/seq-monadic)",
        "Conjoint, MaxDiff, TURF, pricing (Gabor-Granger/PSM)",
        "Audience & segment sizing",
        "Dashboard module for result exploration (optional)",
      ],
    },
  ];

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="methods">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="methods"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Methods Matched to{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Your Objective
          </span>
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {cols.map((c, i) => (
            <motion.div
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
              <ul className="mt-2 space-y-2.5 text-sm text-gray-700">
                {c.items.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-gray-600">
          We document base sizes, significance rules, and any small-base flags. Client data merges supported.
        </p>
      </div>
    </section>
  );
}
