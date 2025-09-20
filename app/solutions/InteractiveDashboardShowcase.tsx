"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function InteractiveDashboardShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="dashboard" className="relative section-slab-deep" aria-labelledby="dashboard-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* Copy */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5"
          >
            <span className="inline-flex items-center rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-300/30">
              Delivery & Access
            </span>
            <h2
              id="dashboard-title"
              className="mt-3 font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.3rem)]"
            >
              Explore, filter, export. <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">All in one place</span>
            </h2>
            <p className="mt-3 text-white/85 text-sm sm:text-base">
              The Interactive Dashboard is how agencies use EcoFocus: filter by audiences (Gen Z, Millennials, parents),
              explore trendlines since 2010, and export white-label charts or CSVs for decks, POVs, and briefs.
            </p>

            <ul className="mt-4 space-y-2.5 text-sm text-white/90">
              {[
                "Seat-based access; optional SSO for enterprise",
                "Filters, crosstabs, and chart/CSV exports",
                "White-label visuals for pitch and client decks",
                "Optional modules for custom questions & joins",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/solutions/dashboard"
                className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 sm:py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                           touch-manipulation
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
              >
                <span className="relative z-10">Learn More</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Request a demo
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="md:col-span-7"
          >
            <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/20">
                <Image
                  src="/images/solutions-dashboard.png"  // <-- replace with your real asset
                  alt="EcoFocus Interactive Dashboard"
                  width={1400}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                />
                {/* Subtle marigold corner tag */}
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
                  Live preview
                </span>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-white/70">
              Example dashboard view. Actual contents depend on license and modules.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
