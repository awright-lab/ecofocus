"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function MethodologyStripe() {
  const r = useReducedMotion();
  const stats = [
    { label: "Years Tracking", value: "13+" },
    { label: "Respondents / Wave", value: "4,000+" },
    { label: "Data Points", value: "90k+" },
    { label: "National MoE", value: "±1.55%" },
  ];

  return (
    <section className="relative section-slab-emerald" aria-labelledby="methodology-stripe">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 text-white">
        <motion.h2
          id="methodology-stripe"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Methodology you can defend
        </motion.h2>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="mt-0.5 text-xs text-white/80">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-white/75">
          MoE refers to national totals; segment MoE varies by base size. Full details in Methodology.
        </p>
      </div>
    </section>
  );
}
