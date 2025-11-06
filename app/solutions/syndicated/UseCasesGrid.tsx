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
    icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
    title: 'For CMOs',
    points: [
      'Translate sustainability into growth with data-backed message and claim testing.',
      'Know which levers drive switching, loyalty, and price tolerance.',
    ],
  },
  {
    icon: <Users className="w-6 h-6 text-emerald-600" />,
    title: 'For CHROs & Talent',
    points: [
      'Link employer brand to the values that matter to emerging talent.',
      'Back your EVP with real data to reduce churn and boost attraction.',
    ],
  },
  {
    icon: <ShoppingBasket className="w-6 h-6 text-emerald-600" />,
    title: 'Retail & Grocery',
    points: [
      'Choose the right on-pack claims and signage for shopper values by region.',
      'Align private label and vendor messaging to demand signals.',
    ],
  },
  {
    icon: <Landmark className="w-6 h-6 text-emerald-600" />,
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        {/* Section badge */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Who It’s For
          </span>
        </div>

        {/* Headline (matches Study Overview) */}
        <motion.h2
          id="use-cases-grid"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5vw,2.3rem)]"
        >
          Use Cases <span className="text-emerald-600">Across the Business</span>
        </motion.h2>

        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto mt-4 max-w-3xl text-center text-slate-600"
        >
          Put EcoFocus insights to work—from brand and retail to talent and finance—so teams act with
          clarity and confidence.
        </motion.p>

        {/* Cards (Study Overview styling) */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u, i) => (
            <motion.div
              key={u.title}
              initial={r ? false : { opacity: 0, y: 8 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="group flex flex-col justify-between rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-sm hover:shadow-md hover:ring-emerald-400 transition-all duration-200"
            >
              <div className="p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  {u.icon}
                </div>
                <h3 className="font-semibold text-slate-900">{u.title}</h3>
                <ul className="mt-3 grid gap-1.5 text-sm text-slate-600">
                  {u.points.map((p) => (
                    <li key={p} className="relative pl-5">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-[4px] w-full rounded-b-2xl bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


