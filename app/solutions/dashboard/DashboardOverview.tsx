"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function DashboardOverview() {
  const reduceMotion = useReducedMotion();

  const steps = [
    {
      title: "Target your audience",
      body:
        "Zero in on Gen Z, Millennials, parents, and category users to get immediately relevant reads.",
    },
    {
      title: "Explore trends & cuts",
      body:
        "Track attitudes and behaviors since 2010. See the say–do gap and segment differences that matter.",
    },
    {
      title: "Export in seconds",
      body:
        "White-label charts for decks/POVs or CSVs for analysts. Everything is agency-ready.",
    },
    {
      title: "Defend & iterate",
      body:
        "Walk into the room with evidence—and refine creative or strategy with confidence.",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="dash-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="dash-overview"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          How agencies use the <span className="text-amber-500">Interactive Dashboard</span>
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mx-auto mt-3 max-w-3xl text-center text-sm sm:text-base text-gray-700"
        >
          From brief to defendable deck—fast. A simple workflow that turns EcoFocus data into on-brief,
          pitch-winning work.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.article
              key={s.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-[13px] font-bold text-emerald-950 ring-1 ring-amber-300/50">
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-700">{s.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
