'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function MethodologyHighlights() {
  const reduceMotion = useReducedMotion();

  const rows = [
    { title: 'Nationally Representative', body: 'U.S. adults 18+, balanced to Census quotas for robust, reliable reads.', icon: 'ri-community-line' },
    { title: '4,000 Sample Size', body: 'Large n for tight confidence intervals and granular cuts.', icon: 'ri-user-3-line' },
    { title: '±1.55% MOE', body: 'Low margin of error for clarity when decisions matter.', icon: 'ri-equalizer-line' },
    { title: 'Since 2010', body: 'Deep trendlines to spot meaningful shifts over time.', icon: 'ri-timer-line' },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="methodology">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="methodology"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Methodology that Leaders Trust
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rows.map((r, i) => (
            <motion.div
              key={r.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
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

  