"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const VALUE_POINTS = [
  "Monthly data mining and insight pulls tailored to active briefs",
  "Strategic framing for pitches, presentations, and executive storytelling",
  "Support for RFPs, proposals, and sustainability messaging decisions",
  "A lighter-weight path before a full seat license or bespoke study",
];

const PACKAGE_ROWS = [
  {
    term: "3 months",
    hours: "8-16 hrs/mo",
    access: "Quick-start support",
    fit: "Ideal for fast-moving pitches, proposals, and near-term strategy work.",
    pricing: [
      { hours: "8 hrs/mo", total: "$3,800" },
      { hours: "12 hrs/mo", total: "$5,580" },
      { hours: "16 hrs/mo", total: "$7,280" },
    ],
    accent: "bg-[linear-gradient(155deg,#5b8c86_0%,#4d7973_45%,#426b66_100%)]",
    ring: "ring-teal-800/20",
    text: "text-white",
    body: "text-white/95",
    divider: "bg-white/35",
    badge: "Quick start",
  },
  {
    term: "6 months",
    hours: "8-16 hrs/mo",
    access: "Balanced support",
    fit: "Built for teams balancing new business work with active client delivery.",
    pricing: [
      { hours: "8 hrs/mo", total: "$3,620" },
      { hours: "12 hrs/mo", total: "$5,310" },
      { hours: "16 hrs/mo", total: "$6,920" },
    ],
    accent: "bg-[linear-gradient(155deg,#e7e1d5_0%,#e3dccf_55%,#ddd6ca_100%)]",
    ring: "ring-stone-200",
    text: "text-slate-900",
    body: "text-slate-900/95",
    divider: "bg-slate-400/35",
    badge: "Most balanced",
  },
  {
    term: "12 months",
    hours: "8-16 hrs/mo",
    access: "Embedded partner",
    fit: "Best for teams that want EcoFocus as an embedded insight partner.",
    pricing: [
      { hours: "8 hrs/mo", total: "$3,440" },
      { hours: "12 hrs/mo", total: "$5,040" },
      { hours: "16 hrs/mo", total: "$6,560" },
    ],
    accent: "bg-[linear-gradient(155deg,#e4e8ee_0%,#dde2ea_52%,#d7dde6_100%)]",
    ring: "ring-slate-200",
    text: "text-slate-900",
    body: "text-slate-900/95",
    divider: "bg-slate-400/35",
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
                  Not ready for a full license? Let us be your go-to research{" "}
                  <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                    team.
                  </span>
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-700 sm:text-base">
                  We understand that you want access to strong sustainability data, but do not always have the internal
                  resources to dig into it, interpret it, and turn it into something usable for current clients or new
                  pitches. We have the solution.
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
                Let us be your go-to research team
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PACKAGE_ROWS.map((row) => (
                <article
                  key={row.term}
                  className={`relative overflow-hidden rounded-xl px-6 py-6 text-center ring-1 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.3)] ${row.ring} ${row.text}`}
                >
                  <div className={`absolute inset-0 ${row.accent}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.35),transparent_38%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.22),transparent_44%)] opacity-30" />
                  <div className="relative flex min-h-[18rem] flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-left text-2xl font-semibold leading-tight">{row.term}</p>
                      <span className="shrink-0 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-2 py-1 text-[10px] font-semibold backdrop-blur-sm">
                        {row.badge}
                      </span>
                    </div>
                    <p className={`mt-3 min-h-[5.5rem] max-w-none text-left text-sm leading-relaxed ${row.body}`}>{row.fit}</p>
                    <div className="mt-5 flex flex-wrap gap-2 text-left text-xs">
                      <span className="whitespace-nowrap rounded-full border border-white/25 bg-white/15 px-2.5 py-1 font-medium backdrop-blur-sm">
                        {row.hours}
                      </span>
                      <span className="whitespace-nowrap rounded-full border border-white/25 bg-white/15 px-2.5 py-1 font-medium backdrop-blur-sm">
                        {row.access}
                      </span>
                    </div>
                    <div className="mt-auto pt-4">
                      <div className={`mb-4 h-px w-full ${row.divider}`} />
                      <div className="space-y-3 text-left">
                        {row.pricing.map((price) => (
                          <div key={price.hours} className="grid grid-cols-[auto_auto] items-baseline justify-between gap-x-4">
                            <span className={`whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] ${row.body}`}>
                              {price.hours}
                            </span>
                            <span className="whitespace-nowrap text-right text-xl font-extrabold leading-tight">{price.total}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
              Not ready for a full license? Let us be your go-to research{" "}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                team.
              </span>
            </h2>
            <p className="mt-4 text-sm text-gray-700 sm:text-base">
              We understand that you want access to strong sustainability data, but do not always have the internal
              resources to dig into it, interpret it, and turn it into something usable for current clients or new
              pitches. We have the solution.
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
                          <li>A lighter-weight path before a full seat license or custom study</li>
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
                    Let us be your go-to research team
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  Choose a structure that matches how often your team needs help translating EcoFocus data into practical,
                  presentation-ready work.
                </p>

                <div className="mt-5 space-y-3">
                  {PACKAGE_ROWS.map((row) => (
                    <div
                      key={row.term}
                      className={`relative overflow-hidden rounded-xl px-5 py-5 ring-1 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.3)] ${row.ring} ${row.text}`}
                    >
                      <div className={`absolute inset-0 ${row.accent}`} />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.35),transparent_38%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.22),transparent_44%)] opacity-30" />
                      <div className="relative flex flex-wrap items-center justify-between gap-3">
                        <p className="pt-2 text-base font-semibold">{row.term}</p>
                        <span className="shrink-0 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-2 py-1 text-[10px] font-semibold backdrop-blur-sm">
                          {row.badge}
                        </span>
                      </div>
                      <p className={`relative mt-2 min-h-[3.75rem] text-xs leading-relaxed ${row.body}`}>{row.fit}</p>
                      <div className="relative mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="whitespace-nowrap rounded-full border border-white/25 bg-white/15 px-2.5 py-1 font-medium backdrop-blur-sm">{row.hours}</span>
                        <span className="whitespace-nowrap rounded-full border border-white/25 bg-white/15 px-2.5 py-1 font-medium backdrop-blur-sm">{row.access}</span>
                      </div>
                      <div className={`relative mt-4 h-px w-full ${row.divider}`} />
                      <div className="relative mt-4 space-y-3">
                        {row.pricing.map((price) => (
                          <div key={price.hours} className="grid grid-cols-[auto_auto] items-baseline justify-between gap-x-4">
                            <span className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] ${row.body}`}>
                              {price.hours}
                            </span>
                            <span className="whitespace-nowrap text-right text-base font-extrabold leading-tight">{price.total}</span>
                          </div>
                        ))}
                      </div>
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
