"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function SolutionsFeaturedOfferings() {
  const reduceMotion = useReducedMotion();

  const offers = [
    {
      badge: "Agency favorite",
      title: "2025 Syndicated Study — Agency License",
      body:
        "Access trend data with dashboard seats and white-label charts. Option to add proprietary questions.",
      bullets: ["n≈4,000/wave; ±1.55% MoE", "Seats for strategy & creative", "Optional buy-ins for custom Qs"],
      href: "/solutions/syndicated",
    },
    {
      badge: "Fastest",
      title: "Interactive Dashboard — Seat Pack",
      body:
        "Pitch-ready filters and chart exports for POVs and briefs. Ideal for day-to-day concepting.",
      bullets: ["Immediate access", "PNG/CSV exports", "Gen Z & Millennial cuts"],
      href: "/contact",
    },
    {
      badge: "Most versatile",
      title: "Data Integration — Add-On",
      body:
        "Blend EcoFocus with client data to sharpen personas and validate claims before launch.",
      bullets: ["Secure merges & schemas", "Bucket/API delivery", "Analyst-friendly docs"],
      href: "/contact",
    },
    {
      badge: "Bespoke",
      title: "Custom Study — Sprint",
      body:
        "Qual + quant tailored to a specific decision (claims, packs, pricing, targeting).",
      bullets: ["Method scoped to outcome", "Say–do gap diagnostics", "Executive-ready reporting"],
      href: "/solutions/custom",
    },
  ];

  return (
    <section id="featured" className="relative bg-brand-tint-blue" aria-labelledby="featured-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="featured-title"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Featured Offerings
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((o, i) => (
            <motion.article
              key={o.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                {o.badge}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">{o.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{o.body}</p>
              <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
                {o.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Link
                  href={o.href}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Learn more
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}



