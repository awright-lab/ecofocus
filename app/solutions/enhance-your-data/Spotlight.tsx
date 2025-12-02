'use client';

import { motion, useReducedMotion } from 'framer-motion';

const items = [
  {
    title: 'Add the Missing Sustainability Dimension',
    body: 'Layer EcoFocus attitudes, behaviors, values, and packaging/claim influence data onto your internal metrics to reveal what truly drives consumer decisions.',
  },
  {
    title: 'Build Purpose-Driven Personas',
    body: 'Transform demographics and purchase patterns into rich sustainability personas that reflect values, trust signals, chemistry concerns, and generational expectations.',
  },
  {
    title: 'Clarify the “Why” Behind Your Numbers',
    body: 'Sales dips, loyalty shifts, messaging failures—EcoFocus adds behavioral and psychographic context that turns your KPIs into actionable diagnostic intelligence.',
  },
];

export default function Spotlight() {
  const r = useReducedMotion();

  return (
    <section className="relative bg-[#0B1320]" aria-labelledby="integration-spotlight">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">

        <motion.h2
          id="integration-spotlight"
          initial={r ? false : { opacity: 0, y: -12 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center text-white font-semibold text-[clamp(1.6rem,4vw,2.3rem)]"
        >
          Why Data Integration Matters
        </motion.h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <motion.div
              key={item.title}
              initial={r ? false : { opacity: 0, y: 16 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 30,
                mass: 0.7,
              }}
              className="rounded-2xl bg-slate-900 p-6 ring-1 ring-white/10
                         shadow-[0_18px_44px_-18px_rgba(0,0,0,0.45)]"
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-slate-300">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
