// app/solutions/custom/CustomStudyTypes.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

const types = [
  {
    label: 'Concept & Claims',
    body:
      'Pressure-test new product, pack, and messaging ideas with the audiences you care about—using EcoFocus’s sustainability lens.',
  },
  {
    label: 'Category & Landscape',
    body:
      'Understand where sustainability is bending your category: who’s leading, who’s lagging, and where whitespace is emerging.',
  },
  {
    label: 'EVP & Talent',
    body:
      'Connect your employer value proposition to values that matter for attraction and retention, especially with younger cohorts.',
  },
  {
    label: 'ESG & Narrative',
    body:
      'Build ESG and purpose narratives that feel credible—not performative—grounded in real expectations from consumers and stakeholders.',
  },
];

export default function CustomStudyTypes() {
  const r = useReducedMotion();

  return (
    <section
      className="relative bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="custom-study-types"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-18">
        <motion.h2
          id="custom-study-types"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Example Study Types
        </motion.h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-slate-600 text-sm sm:text-base">
          Every engagement is tailored, but most custom projects cluster into a few familiar patterns.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t, i) => (
            <motion.article
              key={t.label}
              initial={r ? false : { opacity: 0, y: 8 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_8px_22px_-8px_rgba(15,23,42,0.12)] p-6"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                {t.label}
              </div>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">{t.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
