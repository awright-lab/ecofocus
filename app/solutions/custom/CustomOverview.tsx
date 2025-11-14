'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function CustomOverview() {
  const r = useReducedMotion();

  const pillars = [
    {
      title: 'Custom Projects',
      body:
        'B2C and B2B research designed around your specific business questions – from quick pulses to multi-country deep dives.',
    },
    {
      title: 'From Trend to Deep Dive',
      body:
        'Extend from the EcoFocus sustainability tracker, or commission a stand-alone study when you need a fresh view.',
    },
    {
      title: 'Consulting Partnership',
      body:
        'Our team helps refine the brief, choose the right methods, and turn findings into clear next steps for stakeholders.',
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="custom-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Section badge — mirrors CoreServices / StudyOverview */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">Custom Projects</span>
        </div>

        {/* Headline + body — same 2-column layout + type scale as StudyOverview */}
        <div className="mt-0 md:mt-2 grid grid-cols-1 md:grid-cols-12 md:items-end gap-4 md:gap-6">
          <motion.h2
            id="custom-overview"
            initial={r ? false : { opacity: 0, y: -10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900
                       text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
          >
            Custom Studies{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Built Around Your Questions
            </span>
          </motion.h2>

          <motion.p
            initial={r ? false : { opacity: 0 }}
            whileInView={r ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="md:col-span-6 text-base md:text-lg text-slate-600"
          >
            We offer tailored research solutions that meet you where you are—whether you need to pressure-test a
            concept, understand a new audience, or connect sustainability to growth. We recommend the right approach,
            assemble the methods, and stay with you through design, field, and delivery.
          </motion.p>
        </div>

        {/* Pillars — same card treatment as StudyOverview / CoreServices */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="relative p-[1px] rounded-[1.05rem]
                         bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]"
            >
              <article
                className="h-full rounded-[1rem] bg-white ring-1 ring-gray-100
                           shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)]
                           hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)]
                           transition flex flex-col"
              >
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-slate-900 leading-snug">
                    {p.title}
                  </h3>
                </div>

                <div className="px-6 pb-6">
                  <p className="text-[15px] text-slate-700 leading-relaxed">{p.body}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


