'use client';

import { motion } from 'framer-motion';

export default function QuickStats() {
  const stats = [
    { label: 'Years of Trend Data', value: '13+', icon: 'ri-bar-chart-2-line' },
    { label: 'Data Points Collected', value: '90,000+', icon: 'ri-database-2-line' },
    { label: 'Margin of Error', value: '± 1.55%', icon: 'ri-percent-line' },
  ];

  return (
    <section className="bg-emerald-600 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="flex flex-col items-center justify-center">
              <i className={`${stat.icon} text-3xl text-emerald-300 mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/80 mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}




