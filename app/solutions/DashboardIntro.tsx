"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function DashboardIntro() {
  const reduceMotion = useReducedMotion();

  const steps = [
    {
      title: "Target your audience",
      body:
        "Filter by Gen Z, Millennials, parents, category users, and more to get instantly relevant reads.",
    },
    {
      title: "Explore trends & cuts",
      body:
        "Drill into attitudes, behaviors, say–do gaps, and segments—backed by 13+ years of tracking.",
    },
    {
      title: "Export in seconds",
      body:
        "Pull white-label charts for decks or CSVs for analysts. Perfect for POVs, briefs, and approvals.",
    },
    {
      title: "Defend & iterate",
      body:
        "Bring executive-ready evidence into the room, then refine creative or strategy with confidence.",
    },
  ];

  return (
    <section id="dashboard-intro" className="relative bg-white" aria-labelledby="dashboard-intro-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="dashboard-intro-title"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          How Agencies Use the Interactive Dashboard
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-3 max-w-3xl text-center text-sm sm:text-base text-gray-700"
        >
          From brief to defendable deck—fast. A simple workflow that turns EcoFocus data into on-brief,
          pitch-winning work.
        </motion.p>

        {/* 4-step workflow */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.article
              key={s.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-700">{s.body}</p>
            </motion.article>
          ))}
        </div>

        {/* subtle feature chips */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          {[
            "Seat-based access",
            "SSO (optional)",
            "White-label chart exports",
            "CSV for analysts",
            "Custom modules & joins",
          ].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide text-black/60"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
