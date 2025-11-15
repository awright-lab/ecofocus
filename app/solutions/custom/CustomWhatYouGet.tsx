'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function CustomWhatYouGet() {
  const r = useReducedMotion();

  const cols = [
    {
      title: 'Discovery & Design',
      lines: [
        'Stakeholder discovery sessions',
        'Decision-backwards design and scoping',
        'Questionnaire and stimuli development',
        'Fielding and quality oversight',
      ],
    },
    {
      title: 'Analysis & Story',
      lines: [
        'Rigorous quant + optional qual synthesis',
        'Framework-based segmentation and profiling',
        'Clear “so what / now what” storylines',
        'Charts, verbatims, and exhibits ready for decks',
      ],
    },
    {
      title: 'Activation',
      lines: [
        'Executive read-outs and working sessions',
        'Optional dashboard hooks or data files',
        'Playbooks and guardrails for claims and packs',
        'Follow-up check-ins as you activate',
      ],
    },
  ];

  return (
    <section
      className="relative bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="custom-what-you-get"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="custom-what-you-get"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold text-slate-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Everything You Need to Act on Custom Insights
        </motion.h2>
        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-3 max-w-3xl text-center text-slate-600 text-sm sm:text-base"
        >
          We keep the experience simple: one partner to scope, field, analyze, and activate—
          so you can stay focused on making smart moves, not managing a research maze.
        </motion.p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cols.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-[0_18px_50px_-25px_rgba(15,23,42,0.6)] p-6"
            >
              <h3 className="font-semibold text-slate-900">{c.title}</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                {c.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

