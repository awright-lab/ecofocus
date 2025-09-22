"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Report } from "./data";

export default function ReportCTA({ report }: { report: Report }) {
  const r = useReducedMotion();

  return (
    <section className="relative section-slab-emerald" aria-labelledby="report-cta">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 text-white">
        <motion.h2
          id="report-cta"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Want this in your{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            next deck
          </span>
          ?
        </motion.h2>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {report.purchaseHref ? (
            <Link
              href={report.purchaseHref}
              className="relative inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-md transition-all duration-300
                         before:content-[''] before:absolute before:inset-0 before:rounded-full
                         before:bg-[radial-gradient(circle_at_center,_#ffffff,_#e6f4ea)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">Get full report</span>
            </Link>
          ) : null}

          <Link
            href="/solutions/seat-packs"
            className="relative inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC107] px-6 py-3 text-sm font-semibold text-emerald-950 shadow-md transition-all duration-300
                       before:content-[''] before:absolute before:inset-0 before:rounded-full
                       before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">See seat packs</span>
          </Link>

          <Link
            href="/contact"
            className="relative inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300
                       before:content-[''] before:absolute before:inset-0 before:rounded-full
                       before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Ask about a bundle</span>
          </Link>
        </div>

        <p className="mt-3 text-center text-xs text-white/85">
          Need a specific read not covered here? We can scope a custom module or merge your client data.
        </p>
      </div>
    </section>
  );
}
