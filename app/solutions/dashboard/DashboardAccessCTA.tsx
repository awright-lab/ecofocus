"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function DashboardAccessCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="dash-access">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="dash-access"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Ready to Get Your Team Inside?
        </motion.h2>

        <p className="mx-auto mt-3 max-w-3xl text-center text-sm sm:text-base text-gray-700">
          Choose a Seat Pack to start, or ask for a quick walkthrough.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/solutions/seat-packs"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            See Seat Packs
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Request a demo
          </Link>
        </div>
      </div>
    </section>
  );
}

