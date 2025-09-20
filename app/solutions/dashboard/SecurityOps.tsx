"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SecurityOps() {
  const reduceMotion = useReducedMotion();

  const items = [
    {
      title: "Data handling",
      body:
        "Industry-standard encryption in transit and at rest. Strict access controls following least-privilege principles.",
      icon: "ri-lock-2-line",
    },
    {
      title: "Reliability",
      body:
        "Monitored uptime and error tracking; change-logs accompany each wave so analysts can see what changed and why.",
      icon: "ri-pulse-line",
    },
    {
      title: "Documentation",
      body:
        "Technical appendix, code frames, and data dictionary provided—plus guidance on small-base reads and MoE.",
      icon: "ri-book-2-line",
    },
    {
      title: "Enterprise readiness",
      body:
        "Security reviews and DPAs supported on eligible plans. SSO available; IP restrictions on request.",
      icon: "ri-building-2-line",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="security-ops">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="security-ops"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Security, reliability & documentation
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((c, i) => (
            <motion.div
              key={c.title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${c.icon} text-xl text-emerald-600`} />
                <h3 className="text-base font-semibold text-gray-900">{c.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
