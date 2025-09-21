"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function IntegrationWorkflow() {
  const r = useReducedMotion();

  const steps = [
    {
      k: "01",
      title: "Scope & keys",
      body:
        "Define the decision, pick variables/segments, confirm join keys or hashed IDs. No PII required for most use cases.",
    },
    {
      k: "02",
      title: "Join & QA",
      body:
        "We perform the merge, run balance checks, flag small bases, and document assumptions and code frames.",
    },
    {
      k: "03",
      title: "Reads & views",
      body:
        "Produce saved views, crosstabs, and deltas—optionally surfaced in your Interactive Dashboard module.",
    },
    {
      k: "04",
      title: "Delivery",
      body:
        "Datasets (CSV/Parquet), schemas, and a short readout deck. Secure bucket/API delivery on eligible plans.",
    },
  ];

  return (
    <section className="relative section-slab-emerald" aria-labelledby="workflow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 text-white">
        <motion.h2
          id="workflow"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          How the <span className="text-amber-300">integration</span> works
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.k}
              initial={r ? false : { opacity: 0, y: 10 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-emerald-950 text-xs font-bold">
                {s.k}
              </div>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-white/85">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-white/75">
          We document variables, joins, and flags in an appendix; small-base reads are clearly marked.
        </p>
      </div>
    </section>
  );
}
