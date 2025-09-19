"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Outcomes() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-brand-tint-blue bg-grid-soft" aria-labelledby="outcomes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="mb-8 text-center">
          <motion.h2
            id="outcomes"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
          >
            Outcomes for Agencies
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-gray-700"
          >
            Turn sustainability insights into campaigns that resonate, avoid backlash, and drive
            measurable impact—without reinventing research for every client brief.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Messaging that resonates"
            points={[
              "Align claims with what Millennials & Gen Z actually value",
              "Clarity over jargon—credibility without over-claiming",
              "Audience cuts you can brief directly to creative teams",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Faster from brief to deliverable"
            points={[
              "13+ years of trend data at your fingertips",
              "Charts/exports for decks, pitches, and POVs",
              "Cut research time; move faster on concepts",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Risk & backlash mitigation"
            points={[
              "Diagnose price, access, and authenticity blockers",
              "Validate claims before launch",
              "Guide stakeholders with evidence, not assumptions",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Executive-ready proof"
            points={[
              "Census-balanced, methodologically rigorous data",
              "Clear MoE and sample design for scrutiny",
              "Findings you can defend in the boardroom",
            ]}
          />
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-4"
        >
          <Stat label="Years tracking" value="13+" />
          <Stat label="Data points" value="90k+" />
          <Stat label="Respondents / wave" value="4,000+" />
          <Stat label="MoE (national)" value="±1.55%" />
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
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <ul role="list" className="mt-3 space-y-2.5 text-sm text-gray-700">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="mt-0.5 text-xs text-gray-600">{label}</div>
    </div>
  );
}


