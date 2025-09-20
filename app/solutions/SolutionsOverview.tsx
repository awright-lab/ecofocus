"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function SolutionsOverview() {
  const reduceMotion = useReducedMotion();

  const cards = [
    {
      tag: "Most-used by agencies",
      title: "Syndicated Study",
      body:
        "Nationally representative tracking since 2010—large samples, defendable MoE, and agency-ready outputs.",
      bullets: [
        "n≈4,000 per wave; ±1.55% MoE (nat’l)",
        "Gen Z & Millennial cuts, segments & trends",
        "White-label charts for decks & POVs",
      ],
      href: "/solutions/syndicated",
    },
    {
      tag: "Most versatile",
      title: "Data Integration",
      body:
        "Blend EcoFocus benchmarks with client sales/CRM/BI to sharpen personas and validate claims pre-launch.",
      bullets: [
        "Secure merges; schemas & data dictionary",
        "CSV/Parquet, bucket or API delivery",
        "Optional dashboard views on top of joins",
      ],
      href: "/solutions/enhance-your-data",
    },
    {
      tag: "Deepest evidence",
      title: "Custom Studies",
      body:
        "Audience, claims, pricing, packs, concepts—mix qual + quant to answer the decision you must defend.",
      bullets: [
        "Method scoped to outcome",
        "Say–do gap diagnostics",
        "Executive-ready reporting",
      ],
      href: "/solutions/custom",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="solutions-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="solutions-overview"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Solutions that power agencies
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-3 max-w-3xl text-center text-sm sm:text-base text-gray-700"
        >
          Pick the path that fits your brief. Delivery is consistent and agency-friendly.
        </motion.p>

        {/* 3 pillar cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                {c.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{c.body}</p>
              <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
                {c.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-center">
                <Link
                  href={c.href}
                  className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 sm:py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                           touch-manipulation
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">Learn more</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Delivery callout: Interactive Dashboard */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
        >
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Access & Delivery: Interactive Dashboard</p>
              <p className="mt-1 text-sm text-gray-700">
                The EcoFocus dashboard is how you explore and export results across offerings—seat-based access with white-label charts and CSV exports.
              </p>
            </div>
            <Link
              href="#featured"
              className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 sm:py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                           touch-manipulation
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">See seat packs</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



