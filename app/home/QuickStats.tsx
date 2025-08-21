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
    <section className="bg-emerald-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Mobile: one short row (3 cols, no cards). Desktop: your original card look. */}
        <dl className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="
                flex flex-col items-center justify-center
                py-3 sm:py-4
                md:rounded-2xl md:bg-white/5 md:px-4 md:py-5 md:ring-1 md:ring-white/10
              "
            >
              {/* Screen-reader label; visual label below */}
              <dt className="sr-only">{stat.label}</dt>

              {/* Icon (decorative) */}
              <i
                aria-hidden="true"
                className={`${stat.icon} text-2xl sm:text-3xl md:text-4xl text-[#ffd863] mb-1 sm:mb-2`}
              />

              {/* Value (kept bold, scales up on larger screens) */}
              <dd className="font-bold text-white text-lg sm:text-xl md:text-2xl">
                {stat.value}
              </dd>

              {/* Visual label (compact on mobile, same style on desktop) */}
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm md:text-base leading-snug text-white/85">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}






