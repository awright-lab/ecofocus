// app/components/QuickStats.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function QuickStats() {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    { label: 'Years of Trend Data', value: '13+', icon: 'ri-bar-chart-2-line' },
    { label: 'Data Points Collected', value: '90,000+', icon: 'ri-database-2-line' },
    { label: 'Margin of Error', value: '± 1.55%', icon: 'ri-percent-line' },
  ];

  return (
    <section
      aria-labelledby="quick-stats-heading"
      className="relative bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        {/* (Visually hidden) heading for a11y */}
        <h2 id="quick-stats-heading" className="sr-only">
          Quick Stats
        </h2>

        <div
          className="
            grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8
          "
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              /* Gradient hairline frame for premium look */
              className="
                relative p-[1px] rounded-2xl
                bg-[linear-gradient(135deg,rgba(16,185,129,.35),rgba(59,130,246,.28),transparent)]
              "
            >
              <div
                className="
                  h-full rounded-2xl bg-white
                  ring-1 ring-slate-200
                  shadow-[0_10px_28px_-12px_rgba(2,12,27,0.18)]
                  px-5 py-6 sm:px-6 sm:py-7
                  flex items-center sm:block gap-4 sm:gap-0
                "
              >
                {/* Icon */}
                <div className="shrink-0 sm:mb-3">
                  <span
                    className="
                      inline-flex items-center justify-center
                      h-12 w-12 rounded-xl
                      bg-emerald-50 ring-1 ring-emerald-100
                    "
                    aria-hidden="true"
                  >
                    <i className={`${stat.icon} text-2xl text-emerald-600`} />
                  </span>
                </div>

                {/* Stat content */}
                <div className="min-w-0">
                  <div
                    className="
                      text-3xl sm:text-4xl font-semibold tracking-tight
                      text-slate-900
                    "
                    aria-label={stat.label}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm sm:text-base text-slate-600">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* optional subtle divider under the section for polish */}
        <div className="mt-10 sm:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}







