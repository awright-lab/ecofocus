'use client';

import { motion } from 'framer-motion';

const items = [
  {
    title: 'Ask Your Own Questions',
    body:
      'Explore tens of thousands of sustainability data points and test hypotheses in real time — without waiting for a new report.',
  },
  {
    title: 'De-Risk Messaging',
    body:
      'Validate which sustainability claims build trust, drive purchase intent, and reduce churn before going to market.',
  },
  {
    title: 'Track Change Over Time',
    body:
      'Identify real shifts in attitudes and behaviors using more than a decade of trend data.',
  },
];

export default function DashboardDifferentiators() {
  return (
    <section className="bg-ef-deepgreen">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-light text-white">
            Built for Real Decisions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            This isn’t a reporting tool — it’s a system for answering the
            questions that matter most.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-sm"
            >
              <h3 className="text-xl font-medium text-white">
                {item.title}
              </h3>
              <p className="mt-4 text-white/70 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

