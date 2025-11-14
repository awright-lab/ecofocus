'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

type Block = {
  title: string;
  lines: string[];
  highlight?: boolean;
  ribbon?: string;
};

export default function CustomWhatYouGet() {
  const r = useReducedMotion();

  const blocks: Block[] = [
    {
      title: 'Discovery & Design',
      lines: [
        'Working session to clarify the business decision and objectives.',
        'Recommendation of audience, sample frame, and methodology.',
        'Questionnaire and stimulus design grounded in EcoFocus constructs.',
      ],
      highlight: true,
      ribbon: 'Core Custom Engagement',
    },
    {
      title: 'Field & Analytics',
      lines: [
        'Professional fieldwork management and quality controls.',
        'Integrated analysis that connects sustainability beliefs and behaviors.',
        'Segment cuts, trend overlays, and diagnostics where relevant.',
      ],
    },
    {
      title: 'Delivery & Enablement',
      lines: [
        'Executive-ready storydeck with clear “so what” and “now what.”',
        'Optional workshops to align marketing, insights, and leadership.',
        'White-label charts and visuals for internal and client decks.',
      ],
    },
  ];

  return (
    <section
      className="relative bg-white"
      aria-labelledby="custom-what-you-get"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Badge – mirrors Syndicated What You Get */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">What You Get with Custom</span>
        </div>

        {/* Headline + dek – same structure as Syndicated section */}
        <div className="mt-0 md:mt-2 grid grid-cols-1 md:grid-cols-12 md:items-end gap-4 md:gap-6">
          <motion.h2
            id="custom-what-you-get"
            initial={r ? false : { opacity: 0, y: -10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900
                       text-[clamp(1.8rem,4.5vw,2.5rem)]
                       md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
          >
            A Custom Study That{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Stays Tied to the Decision
            </span>
          </motion.h2>

          <motion.p
            initial={r ? false : { opacity: 0 }}
            whileInView={r ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="md:col-span-6 text-base md:text-lg text-slate-600"
          >
            From initial brief to final storydeck, we design custom work to answer the questions
            that matter most—linking sustainability attitudes and behaviors directly to your
            positioning, concepts, packs, and go-to-market plans.
          </motion.p>
        </div>

        {/* Small benefit strip (optional but matches tone) */}
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Brief-to-decision alignment
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Flexible qual + quant designs
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Executive-ready outputs
          </span>
        </div>

        {/* Cards – same gradient shell + white interior + CTA pattern as Syndicated WhatYouGet */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={r ? false : { opacity: 0, y: 8 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.06 * i }}
              className={`relative p-[1px] rounded-[1.05rem]
                ${
                  b.highlight
                    ? 'bg-[linear-gradient(135deg,rgba(248,184,74,0.6),rgba(16,185,129,0.45),rgba(59,130,246,0.35))]'
                    : 'bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]'
                }`}
            >
              <article
                className="h-full rounded-[1rem] bg-white ring-1 ring-gray-100
                           shadow-[0_10px_28px_-6px_rgba(0,0,0,0.10)]
                           hover:shadow-[0_18px_44px_-12px_rgba(0,0,0,0.18)]
                           transition flex flex-col"
              >
                {/* Ribbon for the highlighted primary option */}
                {b.highlight && b.ribbon ? (
                  <div className="absolute -top-3 left-4">
                    <span className="inline-flex items-center rounded-full bg-[#ef9601] px-3 py-1 text-[10px] font-semibold text-white shadow">
                      {b.ribbon}
                    </span>
                  </div>
                ) : null}

                {/* Header */}
                <div className="px-6 pt-7 pb-4">
                  <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-slate-900 leading-snug">
                    {b.title}
                  </h3>
                </div>

                {/* Bullet list */}
                <div className="px-6 pb-6">
                  <ul className="grid gap-2">
                    {b.lines.map((l) => (
                      <li
                        key={l}
                        className="flex items-start gap-3 text-[15px] text-slate-700 leading-relaxed"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-6 pt-1 pb-6 mt-auto">
                  {b.highlight ? (
                    <>
                      <Link
                        href="/contact"
                        className="inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:translate-y-[1px] transition"
                        aria-label="Contact us to scope a custom study"
                      >
                        Scope a custom study
                      </Link>
                      <p className="mt-2 text-center text-[11px] text-slate-500">
                        Ideal when you have a critical decision or high-stakes initiative.
                      </p>
                    </>
                  ) : (
                    <Link
                      href="/contact"
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                      aria-label={`Contact us about ${b.title}`}
                    >
                      Talk to us
                    </Link>
                  )}
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* Soft divider */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}
