"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function DeliverablesCustom() {
  const r = useReducedMotion();

  const items: { title: string; sub: string }[] = [
    { title: "Executive Deck", sub: "Decision, evidence, and recommendation path" },
    { title: "Technical Appendix", sub: "Method, questionnaire, and QA notes" },
    { title: "Crosstabs / Reads", sub: "Saved views + significance flags" },
    { title: "Dashboard Module (Optional)", sub: "Explore, segment, export white-label charts" },
    { title: "Raw Data (As Scoped)", sub: "CSV/Parquet + schema & data dictionary" },
    { title: "Working Session", sub: "Translate insights to briefs and guardrails" },
  ];

  return (
    <section className="relative section-slab-emerald" aria-labelledby="deliverables-custom">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 text-white">
        <motion.h2
          id="deliverables-custom"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What You{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Receive
          </span>
        </motion.h2>

        <motion.div
          initial={r ? false : { opacity: 0, y: 8 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur sm:grid-cols-3"
        >
          {items.map((it) => (
            <div key={it.title} className="text-center px-2">
              <div className="text-sm font-semibold">{it.title}</div>
              <div className="mt-1 text-xs text-white/85">{it.sub}</div>
            </div>
          ))}
        </motion.div>

        <p className="mt-3 text-center text-xs text-white/75">
          Formats and options depend on scope and audience. Small-base reads are flagged for caution.
        </p>
      </div>
    </section>
  );
}
