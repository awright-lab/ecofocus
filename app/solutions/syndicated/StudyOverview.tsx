"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function StudyOverview() {
  const r = useReducedMotion();

  const points = [
    {
      title: "Purpose, claims & behavior",
      body:
        "Attitudes, stated priorities, pack/claims language, and real behaviors—built to reveal the say–do gap.",
      icon: "ri-chat-check-line",
    },
    {
      title: "Generational focus",
      body:
        "Granular reads for Gen Z and Millennials with segment flags for life stage and category users.",
      icon: "ri-group-line",
    },
    {
      title: "From insight to action",
      body:
        "Agency-ready charts, trends, and cuts to brief creative, validate claims, and de-risk campaigns.",
      icon: "ri-rocket-2-line",
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
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mx-auto mt-3 max-w-3xl text-center text-sm sm:text-base text-gray-700"
        >
          A stable tracker designed for agencies: measure values, evaluate
          sustainability language, and track behaviors over time—then cut by
          your audience and export for decks.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={r ? false : { opacity: 0, y: 12 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${p.icon} text-xl text-emerald-600`} />
                <h3 className="text-base font-semibold text-gray-900">{p.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

