"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function UseCasesForAgencies() {
  const r = useReducedMotion();

  const rows = [
    {
      title: "Pitch & POV backbone",
      body:
        "Anchor claims with defendable stats and trend context; export white-label charts in seconds.",
      icon: "ri-presentation-line",
    },
    {
      title: "Messaging & claims",
      body:
        "Pressure-test language with Gen Z/Millennials; see what resonates and what risks backlash.",
      icon: "ri-double-quotes-l",
    },
    {
      title: "Innovation inputs",
      body:
        "Values → behaviors mapping helps teams prioritize features, packs, and pricing that pass the sniff test.",
      icon: "ri-flask-line",
    },
    {
      title: "Risk mitigation",
      body:
        "Spot the say–do gap, small-base risks, and over-claims early—before work hits the market.",
      icon: "ri-shield-check-line",
    },
  ];

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="use-cases-agencies">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="use-cases-agencies"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Built for <span className="text-amber-500">agency workflows</span>
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {rows.map((r_, i) => (
            <motion.div
              key={r_.title}
              initial={r ? false : { opacity: 0, y: 12 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${r_.icon} text-xl text-emerald-600`} />
                <h3 className="text-base font-semibold text-gray-900">{r_.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{r_.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
