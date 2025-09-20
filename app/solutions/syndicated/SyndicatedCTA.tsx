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
          Ready to Put The Trendlines to Work?
        </motion.h2>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/solutions/seat-packs"
            className="inline-flex items-center justify-center rounded-full relative overflow-hidden min-h-[44px] bg-emerald-600 px-5 py-3 sm:py-2.5 text-sm font-semibold text-white transition-all duration-300
                           touch-manipulation
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">See Seat Packs</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full relative overflow-hidden min-h-[44px] bg-[#FFC107] px-5 py-3 sm:py-2.5 text-sm font-semibold text-black transition-all duration-300
                           touch-manipulation
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Request a briefing</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

