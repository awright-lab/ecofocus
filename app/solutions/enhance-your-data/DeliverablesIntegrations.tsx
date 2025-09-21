"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function DeliverablesIntegrations() {
  const r = useReducedMotion();

  const items: { title: string; sub: string }[] = [
    { title: "Merged Dataset (CSV/Parquet)", sub: "Includes schema + data dictionary" },
    { title: "Saved Views & Crosstabs", sub: "Deltas and significance flags" },
    { title: "Dashboard Module (Optional)", sub: "Filter, segment, export white-label charts" },
    { title: "Secure Delivery", sub: "Bucket or API with signed URLs" },
    { title: "Appendix & QA Notes", sub: "Checks, flags, and assumptions documented" },
    { title: "Executive Summary (Optional)", sub: "Briefing-ready slides for stakeholders" },
  ];

  return (
    <section className="relative section-slab-emerald" aria-labelledby="deliverables">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 text-white">
        <motion.h2
          id="deliverables"
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

        {/* Translucent grid like MethodologyStripe */}
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
              <div className="mt-1 text-xs text-white/80">{it.sub}</div>
            </div>
          ))}
        </motion.div>

        <p className="mt-3 text-center text-xs text-white/75">
          Formats and options depend on scope and plan. Small-base reads are flagged; joins and assumptions are documented.
        </p>
      </div>
    </section>
  );
}
