"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function MethodologyHighlights() {
  const reduceMotion = useReducedMotion();

  const rows = [
    { title: "Nationally representative", body: "U.S. adults 18+, census-balanced with industry-standard weighting for reliable, repeatable reads.", icon: "ri-community-line" },
    { title: "Large samples (n≈4,000/wave)", body: "Tight confidence intervals and granular segment cuts agencies can brief directly to creative.", icon: "ri-user-3-line" },
    { title: "±1.55% margin of error", body: "Clarity when decisions matter—small differences you can defend in stakeholder rooms.", icon: "ri-equalizer-line" },
    { title: "13+ years of trendlines", body: "Since 2010, tracking attitudes → behaviors so you can spot real shifts—not one-off blips.", icon: "ri-timer-line" },
    { title: "Fieldwork quality & fraud controls", body: "Multi-step verification, attention checks, bot/fraud screening, and device/geo checks to protect data integrity.", icon: "ri-shield-check-line" },
    { title: "Transparent methods", body: "Questionnaires, weighting, and sample frames documented—so your methodology stands up to scrutiny.", icon: "ri-file-text-line" },
  ];

  return (
    <section className="relative bg-brand-tint-emerald" aria-labelledby="methodology">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="methodology"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Methodology Agencies Can Defend
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rows.map((r, i) => (
            <motion.div
              key={r.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-3">
                <i className={`${r.icon} text-xl text-emerald-600`} aria-hidden="true" />
                <h3 className="text-base font-semibold text-gray-900">{r.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{r.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-6 max-w-3xl text-center"
        >
          <p className="text-xs text-gray-500">
            Margin of error refers to national totals; segment MoE varies by base size. Full technical details available on request.
          </p>
          <div className="mt-4">
            <a
              href="/methodology"
              className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              View Full Methodology
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}




  