'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function StudyOverview() {
  const r = useReducedMotion();

  const points = [
    {
      title: 'Purpose, claims & behavior',
      body:
        'We connect beliefs and message resonance to the behaviors that drive growth—so you can close the say–do gap with confidence.',
      icon: 'ri-chat-check-line',
    },
    {
      title: 'Generational & parental influence',
      body:
        'Gen Z and Millennials lead, with younger Gen X rising—plus strong parental transmission of environmental values.',
      icon: 'ri-team-line',
    },
    {
      title: 'Packaging & label impact',
      body:
        'Which on-pack claims move the needle—e.g., Plastic-Free, Recyclable, Plant-Based, Certified Carbon Neutral—and which read like greenwashing.',
      icon: 'ri-price-tag-3-line',
    },
    {
      title: 'Corporate responsibility & trust',
      body:
        'How transparency, supply-chain accountability, and EPR expectations shape brand trust and retention.',
      icon: 'ri-shield-check-line',
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="syn-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <motion.h2
          id="syn-overview"
          initial={r ? false : { opacity: 0, y: -8 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What the Syndicated Study Covers
        </motion.h2>

        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mx-auto mt-4 max-w-3xl text-center text-slate-600"
        >
          We decode how sustainability values influence buying, messaging, and retention—turning purpose into a
          business advantage at a fraction of traditional costs.
        </motion.p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={r ? false : { opacity: 0, y: 6 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* simple icon—brand color only, no chip/pill */}
              <div className="mb-2 text-emerald-600">
                <i className={`${p.icon} text-xl`} />
              </div>

              <h3 className="font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


