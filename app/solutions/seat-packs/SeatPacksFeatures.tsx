"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SeatPacksFeatures() {
  const reduceMotion = useReducedMotion();

  const rows = [
    {
      title: "What each seat includes",
      items: [
        "Interactive Dashboard access",
        "Filters & crosstabs by audience (e.g., Gen Z, Millennials, parents)",
        "White-label chart exports (PNG) and CSV downloads",
        "Saved views for faster workflows",
      ],
    },
    {
      title: "Optional add-ons",
      items: [
        "Single sign-on (SSO)",
        "Custom modules (e.g., proprietary questions, joins)",
        "Bucket/API access for data teams",
        "Enablement & training sessions",
      ],
    },
    {
      title: "Security & governance",
      items: [
        "Role-based permissions",
        "Seat analytics & audit trail (select plans)",
        "DPA support and security review for enterprise",
      ],
    },
  ];

  return (
    <section className="relative section-slab-emerald" aria-labelledby="seatpacks-features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="seatpacks-features"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What you get with seat access
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {rows.map((r, i) => (
            <motion.div
              key={r.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="rounded-2xl border border-white/15 bg-white p-6 shadow-lg"
            >
              <h3 className="text-base font-semibold text-gray-900">{r.title}</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
                {r.items.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
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
