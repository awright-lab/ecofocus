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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="syn-overview"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What the Syndicated Study Covers
        </motion.h2>

        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-3xl text-center text-gray-600"
        >
          We decode how sustainability values influence buying, messaging, and retention—turning purpose into a
          business advantage at a fraction of traditional costs.
        </motion.p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-emerald-600 mb-2">
                <i className={`${p.icon} text-xl`} />
              </div>
              <h3 className="font-semibold text-gray-900">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

