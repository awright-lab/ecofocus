'use client';

import { motion, useReducedMotion } from 'framer-motion';

const capabilities = [
  {
    title: 'Message & Claim Testing',
    body:
      'Compare sustainability language like “Plastic-Free” versus “Carbon Neutral” to see what actually changes behavior.',
  },
  {
    title: 'Crosstab & Segmentation',
    body:
      'Analyze responses by demographics, psychographics, attitudes, behaviors, and values-based segments.',
  },
  {
    title: 'Behavioral Profiles',
    body:
      'Move beyond who your audience is into what motivates them — and why.',
  },
  {
    title: 'Trend Analysis',
    body:
      'Spot emerging shifts early and validate whether change is meaningful or just noise.',
  },
];

export default function DashboardCapabilities() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative bg-white"
      aria-labelledby="dashboard-capabilities"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-600">
          Inside the Dashboard
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <motion.h2
            id="dashboard-capabilities"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)]"
          >
            What You Can Do{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Inside the Dashboard
            </span>
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="md:col-span-6 text-base text-slate-600"
          >
            Translate purpose into pricing power, tighter customer loyalty, and better claims in-market with
            workflows built for strategists and insights pros.
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {capabilities.map((cap, idx) => (
            <motion.article
              key={cap.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-[0_14px_44px_-18px_rgba(2,12,27,0.25)]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <span className="text-sm font-semibold">{idx + 1}</span>
              </div>
              <h3 className="mt-5 text-[20px] font-semibold text-slate-900 leading-snug tracking-tight">
                {cap.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{cap.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
