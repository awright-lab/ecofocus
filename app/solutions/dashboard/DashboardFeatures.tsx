"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function DashboardFeatures() {
  const reduceMotion = useReducedMotion();

  const features = [
    {
      title: "Filters & segment cuts",
      body:
        "Slice by Gen Z, Millennials, parents, and category users; build crosstabs and save views.",
      icon: "ri-filter-2-line",
    },
    {
      title: "Trendlines since 2010",
      body:
        "Stable constructs allow like-for-like comparisons across time to spot meaningful shifts.",
      icon: "ri-line-chart-line",
    },
    {
      title: "White-label exports",
      body:
        "Export charts for decks/POVs or CSVs for analysts—everything agency-ready out of the box.",
      icon: "ri-image-line",
    },
    {
      title: "Collaboration-ready",
      body:
        "Seat-based access, optional SSO, and shared assets so strategy and creative can move fast.",
      icon: "ri-team-line",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="dash-features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="dash-features"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Built for agency workflows
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${f.icon} text-xl text-emerald-600`} aria-hidden="true" />
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
