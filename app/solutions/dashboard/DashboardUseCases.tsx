'use client';

import { Briefcase, Landmark, ShoppingBasket, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type UseCase = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  points: string[];
};

const useCases: UseCase[] = [
  {
    icon: Briefcase,
    title: 'CMOs & Brand Leaders',
    points: [
      'Turn purpose into pricing power with validated claims that shift consideration and loyalty.',
      'Close the say/do gap by aligning product and messaging to behaviors that already exist.',
    ],
  },
  {
    icon: Users,
    title: 'CHROs & Talent Leaders',
    points: [
      'Align EVP pillars with what employees actually expect from eco-minded employers.',
      'Back talent storytelling with behavior data to reduce skepticism and retention risk.',
    ],
  },
  {
    icon: ShoppingBasket,
    title: 'Retail & Category Leads',
    points: [
      'Guide shelf messaging, private-label claims, and assortment strategy with shopper-level signals.',
      'Quantify demand for refill, reuse, and certification language across regions and cohorts.',
    ],
  },
  {
    icon: Landmark,
    title: 'Finance & PE Teams',
    points: [
      'Validate sustainability narratives before earnings calls, diligence, or ESG product launches.',
      'Monitor consumer trust, switching risk, and willingness-to-pay to de-risk investments.',
    ],
  },
];

export default function DashboardUseCases() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="dash-use-cases">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-600">
          Who it supports
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <motion.h2
            id="dash-use-cases"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)]"
          >
            Built for Decision-Makers
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="md:col-span-6 text-base text-slate-600"
          >
            From CMOs to private equity teams, EcoFocus equips every leader with the same clean palette and gradient
            accents you saw on our syndicated experience—now pointed at decisions inside the dashboard.
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, idx) => {
            const Icon = useCase.icon;
            return (
              <motion.article
                key={useCase.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="relative rounded-[1.2rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),rgba(255,255,255,0))] p-[1px]"
              >
                <div className="flex h-full flex-col rounded-[1.1rem] bg-white p-6 ring-1 ring-gray-100 shadow-[0_14px_44px_-18px_rgba(2,12,27,0.3)]">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-[19px] font-semibold text-slate-900 leading-snug">{useCase.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {useCase.points.map((point) => (
                      <li key={point} className="relative pl-4 leading-relaxed">
                        <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
