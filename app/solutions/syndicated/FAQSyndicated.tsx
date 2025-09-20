"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function FAQSyndicated() {
  const r = useReducedMotion();

  const faqs = [
    {
      q: "How is the study delivered?",
      a: "Seat-based access to the Interactive Dashboard. Teams can filter, build segments, compare to total, and export white-label charts or CSVs.",
    },
    {
      q: "Can we add our own segments?",
      a: "Yes—use Segment Builder in the dashboard or ask us to configure flags ahead of time for recurring views.",
    },
    {
      q: "Do you provide raw data?",
      a: "CSV exports are available in-app. For BI joins or deeper analysis, secure data deliveries are available on eligible plans under DPA.",
    },
    {
      q: "How often is it updated?",
      a: "Trend integrity is maintained wave-to-wave. Contact us for current fielding cadence and release dates.",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="faq-syndicated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-14">
        <motion.h2
          id="faq-syndicated"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.5rem,5vw,2rem)]"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-4">
          {faqs.map(({ q, a }, i) => (
            <motion.details
              key={q}
              initial={r ? false : { opacity: 0, y: 8 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm open:shadow-md"
            >
              <summary className="cursor-pointer select-none text-sm font-semibold text-gray-900">
                {q}
              </summary>
              <p className="mt-2 text-sm text-gray-700">{a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
