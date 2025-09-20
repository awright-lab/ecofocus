"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function WhatYouGet() {
  const r = useReducedMotion();

  const cols = [
    {
      title: "Included",
      items: [
        "Seat-based access to the Interactive Dashboard",
        "White-label chart exports (PNG) & CSV",
        "Generational & segment filters (e.g., Gen Z, parents)",
      ],
      icon: "ri-checkbox-circle-line",
    },
    {
      title: "Optional add-ons",
      items: [
        "Executive briefing deck",
        "Crosstabs/appendix",
        "Secure data delivery for BI joins (under DPA)",
      ],
      icon: "ri-add-circle-line",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="what-you-get">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="what-you-get"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What You Get
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
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

        <div className="mt-6 text-center">
          <Link
            href="/solutions/seat-packs"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 sm:py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                           touch-manipulation
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">See Seat Packs</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
