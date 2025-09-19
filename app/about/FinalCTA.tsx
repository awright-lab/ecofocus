"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA({
  eyebrow = "Next Steps",
  headline = "Ready to Elevate Your Sustainability Strategy?",
  primary = { label: "Request Details", href: "/contact" },
  secondary = { label: "Explore Benefits", href: "/solutions" },
  subcopy,
}: {
  eyebrow?: string;
  headline?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  subcopy?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative section-slab-deep bg-grid-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-wider text-emerald-300"
          >
            {eyebrow}
          </motion.p>

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-2 font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.2rem)]"
          >
            {headline}
          </motion.h2>

          {subcopy ? (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-white/85"
            >
              {subcopy}
            </motion.p>
          ) : null}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href={primary.href} className="btn-primary-emerald">{primary.label}</Link>
            <Link href={secondary.href} className="btn-secondary-light">{secondary.label}</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



