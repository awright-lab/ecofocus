"use client";

import { motion, useReducedMotion } from "framer-motion";

const pillars = [
  {
    title: "Recurring insight support",
    body:
      "Get monthly help mining EcoFocus data for the stories, tensions, and proof points most relevant to your active work.",
  },
  {
    title: "Strategic framing",
    body:
      "Turn data into stronger pitch narratives, clearer recommendations, and more credible sustainability positioning.",
  },
  {
    title: "Practical flexibility",
    body:
      "Choose a term and support level that fits your workflow now, then scale into broader access or deeper custom work later.",
  },
];

export default function RetainerOverview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="retainer-overview">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">Why It Works</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end md:gap-6">
          <motion.h2
            id="retainer-overview"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
          >
            A lighter-weight path between{" "}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              self-serve access and bespoke research.
            </span>
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="md:col-span-6 text-base md:text-lg text-slate-600"
          >
            The retainer is built for teams that want EcoFocus data and EcoFocus thinking working together month after month.
          </motion.p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.article
              key={pillar.title}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-slate-900">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{pillar.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
