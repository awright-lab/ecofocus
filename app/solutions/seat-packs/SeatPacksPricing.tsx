"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function SeatPacksPricing() {
  const reduceMotion = useReducedMotion();

  const plans = [
    {
      badge: "",
      name: "Starter",
      seats: "2 seats",
      blurb: "Great for small pitch teams that need quick access.",
      features: [
        "Interactive Dashboard access",
        "White-label chart exports (PNG)",
        "CSV exports for analysts",
        "Gen Z & Millennial cuts",
        "Email support",
      ],
    },
    {
      badge: "Most popular",
      name: "Team",
      seats: "5 seats",
      blurb: "Ideal for strategy + creative pods working across accounts.",
      features: [
        "Everything in Starter",
        "Saved views & filters",
        "Shared assets within your org",
        "Priority support",
      ],
      highlight: true,
    },
    {
      badge: "",
      name: "Studio",
      seats: "10 seats",
      blurb: "For multi-discipline studios and larger account teams.",
      features: [
        "Everything in Team",
        "SSO available (add-on)",
        "Seat analytics & audit trail",
        "Quarterly enablement session",
      ],
    },
    {
      badge: "",
      name: "Enterprise",
      seats: "Custom",
      blurb: "For global teams and advanced integrations.",
      features: [
        "Custom seat bundles",
        "Bucket/API access for data teams",
        "Security review & DPA",
        "Dedicated success manager",
      ],
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="seatpacks-pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="seatpacks-pricing"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Choose the right pack for your team
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mx-auto mt-3 max-w-3xl text-center text-sm sm:text-base text-gray-700"
        >
          Pricing varies by license and security needs. Pick a starting point below and we’ll tailor it to your agency.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => (
            <motion.article
              key={p.name}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={`flex flex-col rounded-2xl border bg-white p-6 shadow-lg ${
                p.highlight ? "border-amber-300 ring-1 ring-amber-300/40" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                {p.badge ? (
                  <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-300/50">
                    {p.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-gray-600">{p.seats}</p>
              <p className="mt-2 text-sm text-gray-700">{p.blurb}</p>

              <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  Contact for pricing
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-3xl rounded-xl bg-amber-50 px-4 py-3 text-center text-xs text-amber-900 ring-1 ring-amber-200">
          Volume discounts available. SSO, security review, and data-processing agreements supported for eligible plans.
        </div>
      </div>
    </section>
  );
}
