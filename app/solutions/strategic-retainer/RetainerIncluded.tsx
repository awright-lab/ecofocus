"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const columns = [
  {
    title: "Support You Can Use Right Away",
    lines: [
      "Monthly analyst support tied to active priorities",
      "Insight mining, framing, and deck support",
      "Flexible term and support-hour options",
      "A natural path into broader EcoFocus access later",
    ],
  },
  {
    title: "Typical Deliverables",
    lines: [
      "Pitch proof points and narrative framing",
      "Presentation-ready insight summaries",
      "Messaging and positioning guidance",
      "Support for proposals, RFPs, and executive storytelling",
    ],
  },
  {
    title: "Best Fit",
    lines: [
      "Agencies needing recurring sustainability intelligence",
      "Brand teams that want ongoing strategic support",
      "Consultants who need better consumer proof points",
      "Teams between self-serve access and custom study scope",
    ],
    cta: true,
  },
];

export default function RetainerIncluded() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="retainer-included">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">What You Get</span>
        </div>

        <motion.h2
          id="retainer-included"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
        >
          Strategic support that stays{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            close to the work.
          </span>
        </motion.h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((col, i) => (
            <motion.article
              key={col.title}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-slate-900">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {col.lines.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {col.cta ? (
                <div className="mt-auto pt-6">
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Talk to us about fit
                  </Link>
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
