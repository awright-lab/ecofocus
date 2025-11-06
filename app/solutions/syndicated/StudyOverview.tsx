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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Section badge — mirrors CoreServices */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">Study Overview</span>
        </div>

        {/* Headline + copy — same 2-column layout and typographic scale as CoreServices */}
        <div className="mt-0 md:mt-2 grid grid-cols-1 md:grid-cols-12 md:items-end gap-4 md:gap-6">
          <motion.h2
            id="syn-overview"
            initial={r ? false : { opacity: 0, y: -10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900
                       text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
          >
            What the Syndicated Study{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Covers
            </span>
          </motion.h2>

          <motion.p
            initial={r ? false : { opacity: 0 }}
            whileInView={r ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="md:col-span-6 text-base md:text-lg text-slate-600"
          >
            We decode how sustainability values influence buying, messaging, and retention—turning purpose into a
            business advantage at a fraction of traditional costs.
          </motion.p>
        </div>

        {/* Cards — same cleanliness/shadows/border treatment as CoreServices */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((p) => (
            <div
              key={p.title}
              className="relative p-[1px] rounded-[1.05rem]
                         bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]"
            >
              <article
                className="h-full rounded-[1rem] bg-white ring-1 ring-gray-100
                           shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)]
                           hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)]
                           transition flex flex-col"
              >
                {/* Header block (mirrors CoreServices spacing) */}
                <div className="px-6 pt-6 pb-4">
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${p.color}`}>
                    <i className={`${p.icon} text-[1.05rem]`} />
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-slate-900 leading-snug">
                    {p.title}
                  </h3>
                </div>

                {/* Description (same type rhythm as ExpandableText’s paragraph size) */}
                <div className="px-6 pb-6">
                  <p className="text-[15px] text-slate-700 leading-relaxed">{p.body}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





