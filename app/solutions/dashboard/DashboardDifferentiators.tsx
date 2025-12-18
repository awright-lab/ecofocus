'use client';

import { motion, useReducedMotion } from 'framer-motion';

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
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="dash-differentiators"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-600">
            Why EcoFocus
          </span>
          <motion.h2
            id="dash-differentiators"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-4 font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.4rem)]"
          >
            Built for{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Real Decisions
            </span>
          </motion.h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
            This isn’t a reporting tool — it’s a system for answering the questions that matter most.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative"
            >
              <div className="group relative rounded-[1.7rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),rgba(255,255,255,0))] p-[1.5px] shadow-[0_14px_44px_-18px_rgba(3,7,18,0.4)]">
                <div className="h-full rounded-[1.6rem] bg-white p-8 ring-1 ring-gray-100 transition group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_46px_-20px_rgba(3,7,18,0.5)]">
                  <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
