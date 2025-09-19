"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function MissionApproach() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-brand-tint-emerald" aria-labelledby="mission">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="mb-8 text-center">
          <motion.h2
            id="mission"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
          >
            Our Mission &amp; Approach
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-gray-600"
          >
            We exist to help agencies and brand teams navigate the purpose-driven generation.
            By pairing syndicated trend data with custom studies and activation support,
            we turn sustainability insights into strategies that resonate and convert.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <Card
            className="md:col-span-6"
            title="What we do"
            items={[
              "Track sustainability trends across the U.S. population",
              "Deliver custom qual + quant for agency briefs and client campaigns",
              "Infuse validated insights into client BI tools, personas, and strategy decks",
            ]}
          />
          <Card
            className="md:col-span-6"
            title="How we do it"
            items={[
              "Census-balanced samples and rigorous methodology",
              "Connect attitudes and behaviors to close the say–do gap",
              "Support activation with training, consulting, and rollout enablement",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  items,
  className = "",
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <ul role="list" className="mt-3 space-y-2.5 text-sm text-gray-700">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


