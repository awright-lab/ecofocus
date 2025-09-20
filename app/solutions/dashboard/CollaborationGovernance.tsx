"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function CollaborationGovernance() {
  const reduceMotion = useReducedMotion();

  const cols = [
    {
      title: "Collaboration",
      items: [
        "Seat-based access for strategy, creative, and analytics",
        "Org spaces for shared saved views and assets",
        "Comment/notes fields in saved views (for handoffs)",
      ],
      icon: "ri-team-line",
    },
    {
      title: "Governance",
      items: [
        "Roles: Viewer / Editor / Admin",
        "Seat management and reassignment",
        "Audit trail on Studio/Enterprise plans",
      ],
      icon: "ri-shield-user-line",
    },
    {
      title: "Access options",
      items: [
        "Email + password with 2-step verification",
        "SSO available on select plans",
        "IP allowlist upon request (enterprise)",
      ],
      icon: "ri-key-2-line",
    },
  ];

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="collab-governance">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="collab-governance"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Collaboration & Governance
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cols.map((c, i) => (
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
