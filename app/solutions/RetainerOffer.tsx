"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const VALUE_POINTS = [
  "Monthly data mining and insight pulls tailored to active briefs",
  "Strategic framing for pitches, presentations, and executive storytelling",
  "Support for RFPs, proposals, and sustainability messaging decisions",
  "A practical stepping stone before a full seat license or bespoke study",
];

const PACKAGE_ROWS = [
  { term: "3 months", hours: "8-16 hrs/mo", access: "Light data access", fit: "Pilot a working rhythm fast" },
  { term: "6 months", hours: "8-16 hrs/mo", access: "Blended support + access", fit: "Support active pitches and delivery" },
  { term: "12 months", hours: "8-16 hrs/mo", access: "Best value structure", fit: "Operate with embedded insight support" },
];

export default function RetainerOffer() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="retainer" className="relative bg-white" aria-labelledby="retainer-title">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] tracking-wide text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Ongoing Strategic Support
            </span>
            <h2
              id="retainer-title"
              className="mt-4 font-bold leading-tight text-gray-900 text-[clamp(1.7rem,5vw,2.3rem)]"
            >
              Monthly EcoFocus support for teams that need more than access.
            </h2>
            <p className="mt-4 text-sm text-gray-700 sm:text-base">
              Our retainer model pairs EcoFocus data access with analyst support, strategic framing, and presentation-ready
              guidance so your team can move faster without commissioning a full custom study.
            </p>

            <ul className="mt-5 space-y-3 text-sm text-gray-700">
              {VALUE_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Schedule a discovery call
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Request pricing details
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="md:col-span-7"
          >
            <div className="grid gap-5 lg:grid-cols-[1.05fr_1.2fr]">
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-200">
                <div className="relative h-full min-h-[280px] overflow-hidden rounded-[1.35rem]">
                  <Image
                    src="/images/solutions-consulting.png"
                    alt="EcoFocus strategic advisory support"
                    fill
                    sizes="(min-width: 1024px) 26vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Best for</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/90">
                      Agencies, brand teams, and consultants who want recurring help turning data into decisions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-lg sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Flexible structure</p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">Retainer options by term and support level</h3>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-medium text-emerald-800">
                    Value-led first
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {PACKAGE_ROWS.map((row) => (
                    <div key={row.term} className="rounded-2xl border border-gray-200 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{row.term}</p>
                          <p className="mt-1 text-xs text-gray-500">{row.fit}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">{row.hours}</span>
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800">{row.access}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-gray-500">
                  Public site copy should introduce the model and use cases first. Detailed monthly pricing can stay in the sales
                  conversation or a downloadable rate card.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
