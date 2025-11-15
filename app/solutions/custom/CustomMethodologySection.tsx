'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function CustomMethodologySection() {
  const r = useReducedMotion();

  const stats = [
    { label: 'Years of Trend Data', value: '13+' },
    { label: 'U.S. Respondents / Year', value: '4,000+' },
    { label: 'Custom Projects Delivered', value: '150+' },
    { label: 'Latest Wave Fielded', value: 'Sep 2025' },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="custom-methodology">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16 md:py-18">
        <motion.h2
          id="custom-methodology"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center font-bold text-slate-900 text-[clamp(1.6rem,5vw,2.2rem)]"
        >
          Background & Methodology Snapshot
        </motion.h2>
        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mx-auto mt-3 max-w-3xl text-center text-slate-600"
        >
          Custom work is anchored in the same rigorous approach as our syndicated study:
          census-balanced U.S. adults, robust sample sizes, and clear guardrails around
          design quality and interpretation.
        </motion.p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_30px_-16px_rgba(15,23,42,0.4)] px-4 py-4 sm:px-5 sm:py-5 text-center"
            >
              <div className="text-base font-semibold text-emerald-600">{s.value}</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
