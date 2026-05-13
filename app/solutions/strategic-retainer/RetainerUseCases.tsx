"use client";

import { motion, useReducedMotion } from "framer-motion";

const cases = [
  "Sharpen a pitch or proposal with credible sustainability proof points",
  "Strengthen presentation decks with better framing and export-ready data support",
  "Support messaging, packaging, or positioning conversations with defensible consumer insight",
  "Keep agency or brand teams moving without commissioning a full custom study every time",
];

export default function RetainerUseCases() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="retainer-use-cases">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
        <motion.h2
          id="retainer-use-cases"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Where the Retainer Adds Value
        </motion.h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cases.map((item, i) => (
            <motion.div
              key={item}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-slate-700">{item}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
