// app/solutions/custom/CustomProcess.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

const steps = [
  {
    label: '01 · Clarify the Decision',
    body: 'We start with the decision, not the method—aligning stakeholders on what “good” looks like.',
  },
  {
    label: '02 · Design the Approach',
    body: 'We recommend audiences, sample, and methods (quant, qual, or hybrid) using EcoFocus constructs.',
  },
  {
    label: '03 · Field & Quality',
    body: 'We manage fieldwork and quality control to deliver data you can defend in the boardroom.',
  },
  {
    label: '04 · Synthesis & Story',
    body: 'We connect attitudes, behaviors, and business metrics into a clear, decision-ready story.',
  },
  {
    label: '05 · Activation',
    body: 'We stay with you to socialize findings and support activation where needed.',
  },
];

export default function CustomProcess() {
  const r = useReducedMotion();

  return (
    <section
      className="relative section-slab-emerald"
      aria-labelledby="custom-process"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-18 text-white">
        <motion.h2
          id="custom-process"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.3rem)]"
        >
          How a Custom Engagement Runs
        </motion.h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-white/85 text-sm sm:text-base">
          A simple, guided process—from initial brief to activation—so internal teams stay aligned and supported.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={r ? false : { opacity: 0, y: 10 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.04 * i }}
              className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
            >
              <div className="text-[11px] font-semibold tracking-wide text-emerald-100 uppercase">
                {s.label}
              </div>
              <p className="mt-2 text-sm text-white/90 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
