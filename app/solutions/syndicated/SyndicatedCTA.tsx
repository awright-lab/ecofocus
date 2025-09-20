"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function SyndicatedCTA() {
  const r = useReducedMotion();

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="syn-cta">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="syn-cta"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Ready to put the trendlines to work?
        </motion.h2>

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
            Request a briefing
          </Link>
        </div>
      </div>
    </section>
  );
}

