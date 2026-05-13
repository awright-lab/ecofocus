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
  {
    term: "3 months",
    hours: "8-16 hrs/mo",
    access: "Light data access",
    fit: "Pilot a working rhythm fast",
    accent: "from-[#0f766e] to-[#14b8a6]",
    badge: "Quick start",
  },
  {
    term: "6 months",
    hours: "8-16 hrs/mo",
    access: "Blended support + access",
    fit: "Support active pitches and delivery",
    accent: "from-[#1d4ed8] to-[#38bdf8]",
    badge: "Most balanced",
  },
  {
    term: "12 months",
    hours: "8-16 hrs/mo",
    access: "Best value structure",
    fit: "Operate with embedded insight support",
    accent: "from-[#5b21b6] to-[#a855f7]",
    badge: "Best value",
  },
];

type RetainerOfferProps = {
  compact?: boolean;
};

export default function RetainerOffer({ compact = false }: RetainerOfferProps) {
  const reduceMotion = useReducedMotion();

  if (compact) {
    return (
      <section id="retainer" className="relative bg-white" aria-labelledby="retainer-title">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-gray-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-lg md:p-8"
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] tracking-wide text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                  Ongoing Strategic Support
                </span>
                <h2
                  id="retainer-title"
                  className="mt-4 font-bold leading-tight text-gray-900 text-[clamp(1.65rem,4.8vw,2.35rem)]"
                >
                  Monthly EcoFocus support for teams that need more than access.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-700 sm:text-base">
                  A flexible retainer that pairs EcoFocus data access with analyst support, strategic framing, and
                  presentation-ready guidance for teams that need faster answers without commissioning a full custom study.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 sm:flex-nowrap">
                  <Link
                    href="/solutions/strategic-retainer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Explore the retainer
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                  >
                    Request pricing details
                  </Link>
                </div>
              </div>

              <div className="shrink-0 whitespace-nowrap rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-medium text-emerald-800">
                Access + strategy support
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {PACKAGE_ROWS.map((row) => (
                <article key={row.term} className="relative overflow-hidden rounded-[1.4rem] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${row.accent}`} />
                  <div className="flex items-start justify-between gap-3 pt-2">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{row.term}</p>
                      <p className="mt-2 whitespace-nowrap text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                        {row.hours}
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full border border-gray-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {row.badge}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
                    <span className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800">
                      {row.access}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{row.fit}</p>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

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

            <div className="mt-6 flex flex-wrap gap-3 sm:flex-nowrap">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Schedule a discovery call
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
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
            <div className="grid gap-5 lg:grid-cols-[1.05fr_1.2fr] lg:items-stretch">
              <div className="h-full">
                <div className="relative h-full overflow-hidden rounded-3xl bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-200">
                  <div className="relative h-full min-h-[34rem] overflow-hidden rounded-[1.35rem]">
                    <Image
                      src="/images/solutions-consulting.png"
                      alt="EcoFocus strategic advisory support"
                      fill
                      sizes="(min-width: 1024px) 26vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="rounded-2xl border border-white/15 bg-slate-950/72 p-5 backdrop-blur-sm text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">What it unlocks</p>
                        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-white/95">
                          <li>Monthly insight mining tailored to active briefs</li>
                          <li>Strategic framing for decks, pitches, and presentations</li>
                          <li>Support for proposals, messaging, and stakeholder storytelling</li>
                          <li>A practical bridge before a full seat license or custom study</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-lg sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Flexible monthly engagement
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">Retainer options by term and support level</h3>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-medium text-emerald-800">
                    Access + strategy support
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  Choose a structure that matches how often your team needs help translating EcoFocus data into practical,
                  presentation-ready work.
                </p>

                <div className="mt-5 space-y-3">
                  {PACKAGE_ROWS.map((row) => (
                    <div key={row.term} className="relative overflow-hidden rounded-[1.4rem] border border-gray-200 bg-white p-4 shadow-sm">
                      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${row.accent}`} />
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="pt-2 text-base font-semibold text-gray-900">{row.term}</p>
                          <p className="mt-1 text-xs text-gray-500">{row.fit}</p>
                        </div>
                        <span className="shrink-0 whitespace-nowrap rounded-full border border-gray-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                          {row.badge}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
                        <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">{row.hours}</span>
                        <span className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800">{row.access}</span>
                      </div>
                      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                      <p className="mt-4 text-xs leading-relaxed text-slate-500">
                        Start with the cadence that fits now, then expand support as your team’s needs evolve.
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid items-stretch gap-4 md:grid-cols-[1fr_1fr]">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                    <p className="text-sm font-semibold text-slate-900">What’s included</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      Flexible monthly insight support powered by EcoFocus data, including analysis, framing, deck support,
                      and guidance tailored to your active business development and client needs.
                    </p>
                  </div>

                  <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">How to get started</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      Book a discovery call to talk through your team’s workflow, support needs, and the retainer structure
                      that makes the most sense.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Go to contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
