'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, Users, ShoppingBasket, Landmark } from 'lucide-react';

type UseCase = {
  icon: JSX.Element;
  title: string;
  points: string[];
};

const useCases: UseCase[] = [
  {
    icon: <Briefcase className="w-6 h-6 text-emerald-700" />,
    title: 'For CMOs',
    points: [
      'Translate sustainability into growth with data-backed message and claim testing.',
      'Know which levers drive switching, loyalty, and price tolerance.',
    ],
  },
  {
    icon: <Users className="w-6 h-6 text-emerald-700" />,
    title: 'For CHROs & Talent',
    points: [
      'Link employer brand to the values that matter to emerging talent.',
      'Back your EVP with real data to reduce churn and boost attraction.',
    ],
  },
  {
    icon: <ShoppingBasket className="w-6 h-6 text-emerald-700" />,
    title: 'Retail & Grocery',
    points: [
      'Choose the right on-pack claims and signage for shopper values by region.',
      'Align private label and vendor messaging to demand signals.',
    ],
  },
  {
    icon: <Landmark className="w-6 h-6 text-emerald-700" />,
    title: 'Financial Services',
    points: [
      'Understand which sustainability themes build trust with younger customers.',
      'Validate ESG product narratives and avoid greenwashing.',
    ],
  },
];

export default function UseCasesGrid() {
  const r = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="use-cases-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Badge — same as StudyOverview/CoreServices */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">Who It’s For</span>
        </div>

        {/* Headline + copy — two-column layout identical to StudyOverview */}
        <div className="mt-0 md:mt-2 grid grid-cols-1 md:grid-cols-12 md:items-end gap-4 md:gap-6">
          <motion.h2
            id="use-cases-grid"
            initial={r ? false : { opacity: 0, y: -10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900
                       text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
          >
            Use Cases{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Across the Business
            </span>
          </motion.h2>

          <motion.p
            initial={r ? false : { opacity: 0 }}
            whileInView={r ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="md:col-span-6 text-base md:text-lg text-slate-600"
          >
            Put EcoFocus insights to work—from brand and retail to talent and finance—so teams act
            with clarity and confidence.
          </motion.p>
        </div>

        {/* Cards — gradient edge, white inner card, same ring/shadows */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((u) => (
            <div
              key={u.title}
              className="relative p-[1px] rounded-[1.05rem]
                         bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]"
            >
              <article
                className="h-full rounded-[1rem] bg-white ring-1 ring-gray-100
                           shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)]
                           hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)]
                           transition flex flex-col"
              >
                <div className="px-6 pt-6 pb-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    {u.icon}
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-slate-900 leading-snug">
                    {u.title}
                  </h3>
                </div>

                <div className="px-6 pb-6">
                  <ul className="grid gap-1.5">
                    {u.points.map((p) => (
                      <li key={p} className="relative pl-5 text-[15px] text-slate-700 leading-relaxed">
                        <span
                          aria-hidden
                          className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


