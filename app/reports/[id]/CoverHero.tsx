"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Report } from "./data";

export default function CoverHero({ report }: { report: Report }) {
  const r = useReducedMotion();
  return (
    <section className="relative overflow-hidden" aria-label="Report cover">
      <div className="relative h-[44vh] min-h-[320px] w-full bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={r ? false : { opacity: 0, y: 6 }}
            animate={r ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[3/4] w-[min(420px,68vw)] overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 shadow-2xl"
          >
            <Image
              src={report.cover}
              alt={`${report.title} – cover`}
              fill
              className="object-contain"
              sizes="(min-width:1280px) 420px, 68vw"
              priority
            />
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
              {report.type}
            </span>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,_rgba(16,185,129,0.15),_transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.8rem,5.6vw,2.6rem)]">
          {report.title} {report.wave ? <span className="text-gray-400">({report.wave})</span> : null}
        </h1>
        {report.subtitle ? (
          <p className="mx-auto mt-2 max-w-3xl text-center text-sm sm:text-base text-gray-700">
            {report.subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
