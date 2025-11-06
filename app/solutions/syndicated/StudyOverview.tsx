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
    <section
      className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white"
      aria-labelledby="syn-overview"
    >
      {/* subtle brand accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full
                   bg-gradient-to-r from-emerald-200/50 via-teal-200/40 to-emerald-100/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-[-10%] h-72 w-96 rotate-12 rounded-full
                   bg-gradient-to-tr from-emerald-200/50 via-teal-100/40 to-emerald-50/30 blur-2xl"
      />

      {/* thin top accent line, mirrors home sections */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-300/60 via-emerald-200/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        {/* kicker pill */}
        <motion.div
          initial={r ? false : { opacity: 0, y: -6 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-4 flex justify-center"
        >
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
            Syndicated Study
          </span>
        </motion.div>

        {/* headline with brand gradient accent (matching home style) */}
        <motion.h2
          id="syn-overview"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center font-bold leading-tight text-slate-900 text-[clamp(1.75rem,5vw,2.4rem)]"
        >
          What the{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
            Syndicated Study
          </span>{' '}
          Covers
        </motion.h2>

        {/* subtle underline accent */}
        <div className="mx-auto mt-3 h-[3px] w-20 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300" />

        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-5 max-w-3xl text-center text-slate-600"
        >
          We decode how sustainability values influence buying, messaging, and retention—turning purpose into a
          business advantage at a fraction of traditional costs.
        </motion.p>

        {/* cards: match homepage chrome (ring, rounded, soft shadow, hover-lift, icon chip) */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={r ? false : { opacity: 0, y: 8 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.06 * i }}
              className="
                group relative rounded-2xl bg-white p-6
                ring-1 ring-slate-200/70 shadow-sm
                hover:shadow-md hover:shadow-slate-200/60 transition-shadow
              "
            >
              {/* gradient top hairline like home tiles */}
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
                <i className={`${p.icon} text-[1.25rem] text-emerald-600`} />
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

