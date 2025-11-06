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
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Generational & parental influence',
      body:
        'Gen Z and Millennials lead, with younger Gen X rising—plus strong parental transmission of environmental values.',
      icon: 'ri-team-line',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      title: 'Packaging & label impact',
      body:
        'Which on-pack claims move the needle—Plastic-Free, Recyclable, Plant-Based, Certified Carbon Neutral—and which read like greenwashing.',
      icon: 'ri-price-tag-3-line',
      color: 'bg-teal-100 text-teal-700',
    },
    {
      title: 'Corporate responsibility & trust',
      body:
        'How transparency, supply-chain accountability, and EPR expectations shape brand trust and retention.',
      icon: 'ri-shield-check-line',
      color: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="syn-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        {/* Category label */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Research Focus
          </span>
        </div>

        {/* Headline */}
        <motion.h2
          id="syn-overview"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5vw,2.3rem)]"
        >
          What the <span className="text-emerald-600">Syndicated Study</span> Covers
        </motion.h2>

        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto mt-4 max-w-3xl text-center text-slate-600"
        >
          We decode how sustainability values influence buying, messaging, and retention—turning purpose into a
          business advantage at a fraction of traditional costs.
        </motion.p>

        {/* Card Grid */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={r ? false : { opacity: 0, y: 8 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="group flex flex-col justify-between rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-sm hover:shadow-md hover:ring-emerald-400 transition-all duration-200"
            >
              <div className="p-6">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${p.color}`}>
                  <i className={`${p.icon} text-lg`} />
                </div>
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.body}</p>
              </div>
              <div className="h-[4px] w-full rounded-b-2xl bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}




