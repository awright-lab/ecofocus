'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function WhatYouGet() {
  const r = useReducedMotion();
  const cols = [
    {
      title: 'Syndicated Access',
      lines: [
        'All dashboard modules',
        'Crosstabs & quick exports',
        'Two onboarding sessions',
        'Quarterly consult touchpoints',
      ],
    },
    {
      title: 'Custom Add-Ons',
      lines: [
        'Proprietary questions fielded in the next wave',
        'Custom dashboard including your proprietary data',
        'Executive summary of custom results',
      ],
    },
    {
      title: 'Integration',
      lines: [
        'Wrap EcoFocus data around your existing research',
        'Augment personas & journey maps',
        'De-risk messaging & packaging decisions',
      ],
    },
  ];

  return (
    <section className="relative bg-gray-50" aria-labelledby="what-you-get">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="what-you-get"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What You Get
        </motion.h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">{c.title}</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
                {c.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

