'use client';

import { motion, useReducedMotion } from 'framer-motion';

const highlights = [
  {
    title: 'Full Module Access',
    body: 'Explore every sustainability module, segment, and trendline as soon as the wave launches.',
  },
  {
    title: 'Guided Onboarding',
    body: 'Live enablement sessions, recorded refreshers, and quarterly consultation hours.',
  },
  {
    title: 'Seat-Based Licensing',
    body: 'Simple tiers sized to your org—scale from a pilot pod to enterprise-wide access.',
  },
];

export default function DashboardAccess() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-gray-50" aria-labelledby="dash-access-details">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-3xl bg-white p-8 sm:p-10 text-center ring-1 ring-gray-200 shadow-[0_24px_60px_-30px_rgba(3,7,18,0.65)]">
          <motion.h2
            id="dash-access-details"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-[clamp(1.8rem,4.5vw,2.4rem)] font-bold text-slate-900"
          >
            Always-On Access
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="mt-3 text-base text-slate-600"
          >
            Dashboard logins stay live 24/7/365 via any modern browser—mirroring the frictionless experience showcased
            on the syndicated page but tuned to your subscriptions.
          </motion.p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-5 text-sm text-slate-600">
                <h3 className="text-base font-semibold text-slate-900">{highlight.title}</h3>
                <p className="mt-2 leading-relaxed">{highlight.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
