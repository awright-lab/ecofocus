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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        {/* Use a definition list for semantics; each item = one stat */}
        <dl className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl bg-white/5 px-4 py-5 sm:px-5 sm:py-6 ring-1 ring-white/10"
            >
              {/* Screen-reader label; we also show a visual label below */}
              <dt className="sr-only">{stat.label}</dt>

              <div className="flex flex-col items-center justify-center">
                {/* Icon (decorative) */}
                <i
                  aria-hidden="true"
                  className={`${stat.icon} text-3xl sm:text-4xl text-[#ffd863] mb-2`}
                />

                {/* Value (fluid size on mobile) */}
                <dd className="font-bold text-white text-[clamp(1.5rem,6vw,2rem)]">
                  {stat.value}
                </dd>

                {/* Visual label (legible on mobile, scales up slightly) */}
                <p className="mt-1 text-sm sm:text-base text-white/85">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}





