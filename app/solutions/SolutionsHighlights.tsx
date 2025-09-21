"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SolutionsHighlights() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative section-slab-deep" aria-labelledby="outcomes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="mb-8 text-center">
          <motion.h2
            id="outcomes"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.2rem)]"
          >
            Outcomes for Agencies
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/85"
          >
            Turn EcoFocus insights into on-brief, pitch-winning work—faster. Equip strategy and
            creative with defendable evidence clients can trust.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Win pitches & approvals"
            points={[
              "White-label charts for decks and POVs",
              "Proof points aligned to Gen Z & Millennial values",
              "Cuts you can brief straight to creative",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Resonate without risk"
            points={[
              "Say–do gap metrics to avoid backlash",
              "Validate claims before launch",
              "Diagnose price, access & authenticity blockers",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Move faster with evidence"
            points={[
              "13+ years of trend data on tap",
              "Exports for slides/CSV in minutes",
              "Cut research spin; ship concepts sooner",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Executive-ready proof"
            points={[
              "Census-balanced, rigorous methods",
              "Clear MoE & sample design for scrutiny",
              "Findings you can defend in the boardroom",
            ]}
          />
        </div>

        {/* Emerald stat slab */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 grid grid-cols-2 gap-4 rounded-2xl section-slab-emerald p-6 shadow-lg sm:grid-cols-4"
        >
          <Stat label="Years tracking" value="13+" inverse />
          <Stat label="Data points" value="90k+" inverse />
          <Stat label="Respondents / wave" value="4,000+" inverse />
          <Stat label="MoE (national)" value="±1.55%" inverse />
        </motion.div>
      </div>
    </section>
  );
}

function BenefitCard({
  title,
  points,
  className = "",
}: {
  title: string;
  points: string[];
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <ul role="list" className="mt-3 space-y-2.5 text-sm text-gray-700">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400"
              aria-hidden="true"
            />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: string;
  inverse?: boolean;
}) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${inverse ? "text-white" : "text-gray-900"}`}>{value}</div>
      <div className={`mt-0.5 text-xs ${inverse ? "text-white/85" : "text-gray-600"}`}>{label}</div>
    </div>
  );
}


