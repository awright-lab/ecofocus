// app/reports/[id]/sections/CoverHero.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Report } from "@/lib/reports-repo";

export default function CoverHero({ report }: { report: Report }) {
  const r = useReducedMotion();
  return (
    <section className="relative overflow-hidden section-hero-deep">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-6-poster.jpg"
      >
        <source src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/35" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-18 md:py-20 text-white">
        <motion.p
          initial={r ? false : { opacity: 0, y: -6 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold uppercase tracking-wider text-white/90"
        >
          {report.access === "Free" ? "Free Report" : "Premium Report"}
        </motion.p>

        <motion.h1
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-2 max-w-3xl font-bold leading-tight text-[clamp(1.8rem,5.2vw,2.6rem)]"
        >
          {report.title}
        </motion.h1>

        {report.subtitle && (
          <motion.p
            initial={r ? false : { opacity: 0 }}
            whileInView={r ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-3 max-w-2xl text-sm sm:text-base text-white/90"
          >
            {report.subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}

