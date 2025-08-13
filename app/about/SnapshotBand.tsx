'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function SnapshotBand() {
  const reduceMotion = useReducedMotion();
  const stats = [
    { label: 'Years of Trend Data', value: '13+', icon: 'ri-bar-chart-2-line' },
    { label: 'Data Points Collected', value: '90,000+', icon: 'ri-database-2-line' },
    { label: 'Margin of Error', value: '± 1.55%', icon: 'ri-percent-line' },
  ];

  return (
    <section className="bg-emerald-600">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center text-white"
          >
            <div className="mx-auto flex max-w-xs flex-col items-center">
              <i className={`${s.icon} mb-2 text-3xl text-[#ffd863]`} />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm text-white/85">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
