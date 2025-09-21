"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SecurityGovernance() {
  const r = useReducedMotion();

  const cols = [
    {
      title: "Security",
      items: [
        "Encryption in transit and at rest",
        "Least-privilege access & audit trail (eligible plans)",
        "Bucket/API delivery with signed URLs",
      ],
      icon: "ri-shield-keyhole-line",
    },
    {
      title: "Governance",
      items: [
        "DPA support for Enterprise",
        "SSO on Studio/Enterprise (add-on for eligible Team)",
        "IP allowlists on request",
      ],
      icon: "ri-folder-shield-2-line",
    },
    {
      title: "Privacy",
      items: [
        "Hashed IDs and aggregated joins supported",
        "No PII required for most integrations",
        "Clear documentation of assumptions",
      ],
      icon: "ri-lock-2-line",
    },
  ];

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="security-governance">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="security-governance"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Security, governance & privacy
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cols.map((c, i) => (
            <motion.div
              key={c.title}
              initial={r ? false : { opacity: 0, y: 12 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${c.icon} text-xl text-emerald-600`} />
                <h3 className="text-base font-semibold text-gray-900">{c.title}</h3>
              </div>
              <ul className="mt-2 space-y-2.5 text-sm text-gray-700">
                {c.items.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" />
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
