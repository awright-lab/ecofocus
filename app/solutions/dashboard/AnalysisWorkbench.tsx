"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function AnalysisWorkbench() {
  const reduceMotion = useReducedMotion();

  const left = [
    {
      title: "Segment Builder",
      body:
        "Create custom cohorts with boolean logic (e.g., Gen Z AND heavy category users AND value authenticity). Save and reuse across views.",
    },
    {
      title: "Crosstabs & significance",
      body:
        "Fast row/column tabs with small-base flags. Highlights meaningful deltas so teams don’t over-read noise.",
    },
    {
      title: "Time comparisons",
      body:
        "Wave-to-wave and multi-year trend comparisons with annotations when methodology changes.",
    },
  ];

  const right = [
    {
      title: "Say–Do Gap diagnostics",
      body:
        "Side-by-side attitude vs. behavior views help teams anticipate backlash and optimize claims.",
    },
    {
      title: "Saved Views",
      body:
        "Package filters, segments, and charts into a saved view—perfect for recurring decks and weekly stand-ups.",
    },
    {
      title: "Keyboard-friendly UX",
      body:
        "Designed with accessibility best practices (labels, focus states, and logical tab order).",
    },
  ];

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="analysis-workbench">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="analysis-workbench"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Analysis workbench (how you get answers)
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left column */}
          <div className="md:col-span-4 space-y-4">
            {left.map((b, i) => (
              <motion.div
                key={b.title}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg"
              >
                <h3 className="text-base font-semibold text-gray-900">{b.title}</h3>
                <p className="mt-1.5 text-sm text-gray-700">{b.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Screenshot center */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="md:col-span-4"
          >
            <div className="relative rounded-3xl bg-white p-2 ring-1 ring-gray-200 shadow-xl">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/images/workbench-preview.png" // replace with focused ‘tabs/filters’ screenshot
                  alt="Analysis workbench preview"
                  width={1360}
                  height={900}
                  className="h-auto w-full object-cover"
                />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
                  Workbench preview
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="md:col-span-4 space-y-4">
            {right.map((b, i) => (
              <motion.div
                key={b.title}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg"
              >
                <h3 className="text-base font-semibold text-gray-900">{b.title}</h3>
                <p className="mt-1.5 text-sm text-gray-700">{b.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

