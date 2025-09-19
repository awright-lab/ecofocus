"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function BottomCTA({
  eyebrow = "Get Started",
  headline = "Turn sustainability insights into campaigns that resonate.",
  ctaLabel = "Book an Agency Briefing",
  ctaHref = "/contact",
  subcopy,
}: {
  eyebrow?: string;
  headline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  subcopy?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#E0F4FF_0%,white_90%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-wider text-emerald-700"
          >
            {eyebrow}
          </motion.p>

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-2 font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
          >
            {headline}
          </motion.h2>

          {subcopy ? (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-gray-700"
            >
              {subcopy}
            </motion.p>
          ) : null}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-6"
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {ctaLabel}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

