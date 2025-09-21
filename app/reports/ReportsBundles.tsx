"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ReportsBundles() {
  const r = useReducedMotion();

  const items = [
    { title: "Single report", sub: "One-off license for a specific team", icon: "ri-file-text-line" },
    { title: "Agency bundle", sub: "Multi-report savings + dashboard seats", icon: "ri-stack-line" },
    { title: "Enterprise license", sub: "Org-wide access, SSO & DPA eligible", icon: "ri-building-4-line" },
  ] as const;

  return (
    <section className="relative section-slab-emerald" aria-labelledby="report-bundles">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 text-white">
        <motion.h2
          id="report-bundles"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Licensing & bundles
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
              <div className="mb-1 flex items-center justify-center gap-2 text-sm font-semibold">
                <i className={`${it.icon} text-lg`} aria-hidden="true" />
                <span>{it.title}</span>
              </div>
              <div className="text-xs text-white/85">{it.sub}</div>
            </div>
          ))}
        </motion.div>

        <p className="mt-3 text-center text-xs text-white/75">
          White-label exports by default. See seat pack options for broader dashboard access.
        </p>
      </div>
    </section>
  );
}
