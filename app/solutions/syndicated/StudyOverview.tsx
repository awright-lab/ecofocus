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
          className="text-center font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5vw,2.3rem)]"
        >
          What the Syndicated Study Covers
        </motion.h2>

        {/* thin emerald rule under the heading (homepage-style accent) */}
        <div className="mx-auto mt-3 h-[3px] w-20 rounded-full bg-emerald-500/90" />

        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mx-auto mt-5 max-w-3xl text-center text-slate-600"
        >
          We decode how sustainability values influence buying, messaging, and retention—turning purpose into a
          business advantage at a fraction of traditional costs.
        </motion.p>

        {/* tiles matching the homepage "Quick Stats" chrome: white, ring-1, soft shadow, slate text */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={r ? false : { opacity: 0, y: 6 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="
                group relative rounded-2xl bg-white p-6
                ring-1 ring-slate-200/80 shadow-sm
                hover:ring-emerald-400 hover:shadow-md transition-all duration-200
              "
            >
              {/* simple color pop: emerald icon on an ultra-light flat chip (no gradients/pills) */}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <i className={`${p.icon} text-[1.125rem]`} />
              </div>

              <h3 className="font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.body}</p>

              {/* subtle left accent on hover to echo home’s restrained color usage */}
              <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-emerald-500/0 transition-colors duration-200 group-hover:bg-emerald-500/80" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



