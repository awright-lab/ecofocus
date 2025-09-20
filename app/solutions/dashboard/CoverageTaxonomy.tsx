"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function CoverageTaxonomy() {
  const reduceMotion = useReducedMotion();

  const blocks = [
    {
      title: "Population Coverage",
      items: [
        "U.S. adults 18+; nationally representative",
        "Census-balanced weighting; clear MoE guidance",
        "Since 2010 for trend comparability",
      ],
      icon: "ri-community-line",
    },
    {
      title: "Question Taxonomy",
      items: [
        "Attitudes, behaviors, and say–do diagnostics",
        "Claims/packaging/values language, purchase drivers",
        "Category and life-stage cuts (e.g., Gen Z, parents)",
      ],
      icon: "ri-file-list-3-line",
    },
    {
      title: "Data Structure",
      items: [
        "Stable variable names & code frames each wave",
        "Change-log notes for wording/scale bridges",
        "Segment flags for fast filters/crosstabs",
      ],
      icon: "ri-database-2-line",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="coverage-taxonomy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="coverage-taxonomy"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Coverage & Taxonomy (What’s Inside)
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${b.icon} text-xl text-emerald-600`} />
                <h3 className="text-base font-semibold text-gray-900">{b.title}</h3>
              </div>
              <ul className="mt-2 space-y-2.5 text-sm text-gray-700">
                {b.items.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
