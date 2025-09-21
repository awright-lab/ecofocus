"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function CustomWorkflow() {
  const r = useReducedMotion();

  const rows = [
    {
      title: "Discover",
      body:
        "Clarify the decision, stakeholders, and risk areas. Identify segments and guardrails.",
      icon: "ri-search-eye-line",
    },
    {
      title: "Design",
      body:
        "Select methods (qual/quant), build instruments, and align on success criteria & reads.",
      icon: "ri-tools-line",
    },
    {
      title: "Field & QA",
      body:
        "Run the study with quality controls, then clean, weight (if applicable), and verify outputs.",
      icon: "ri-verified-badge-line",
    },
    {
      title: "Readout & Activation",
      body:
        "Executive deck + appendix; optional dashboard module; working session to translate to briefs.",
      icon: "ri-slideshow-2-line",
    },
  ];

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="workflow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="workflow"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          How a Custom Study Runs
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {rows.map((r_, i) => (
            <motion.article
              key={r_.title}
              initial={r ? false : { opacity: 0, y: 12 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${r_.icon} text-xl text-emerald-600`} aria-hidden="true" />
                <h3 className="text-base font-semibold text-gray-900">{r_.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{r_.body}</p>
            </motion.article>
          ))}
        </div>

        <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-gray-600">
          Typical timelines: 2–8 weeks depending on scope. We’ll advise on bases and MoE by segment.
        </p>
      </div>
    </section>
  );
}
