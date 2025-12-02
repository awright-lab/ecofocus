'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

type Col = {
  title: string;
  lines: string[];
  highlight?: boolean;
  ribbon?: string;
};

export default function WhatYouGet() {
  const r = useReducedMotion();

  const cols: Col[] = [
    {
      title: 'Data Integration Package',
      highlight: true,
      ribbon: 'Most Popular',
      lines: [
        'Merge EcoFocus trends with your internal datasets',
        'Sustainability enrichment for KPIs, personas & funnels',
        'Diagnostics to explain “why” your numbers move',
        'Executive-ready deliverables',
        'Optional dashboard blending',
      ],
    },
    {
      title: 'Add-On Enhancements',
      lines: [
        'Proprietary questions appended to next EcoFocus wave',
        'Custom audience cuts and sustainability personas',
        'Additional data layers (chemicals, label influence, climate signals)',
        'Qualitative add-ons or journey-based insights',
      ],
    },
    {
      title: 'Integration Support',
      lines: [
        'Plug enhanced data into your dashboards & systems',
        'Persona alignment, journey mapping & KPI overlay',
        'ESG narrative support and message validation',
        'Cross-functional activation workshops',
      ],
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="what-you-get">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">

        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">What’s Included</span>
        </div>

        {/* Headline */}
        <div className="mt-0 md:mt-2 grid grid-cols-1 md:grid-cols-12 md:items-end gap-4 md:gap-6">
          <motion.h2
            id="what-you-get"
            initial={r ? false : { opacity: 0, y: -10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900
                       text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
          >
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Enhance Your Data
            </span>
          </motion.h2>

          <motion.p
            initial={r ? false : { opacity: 0 }}
            whileInView={r ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="md:col-span-6 text-base md:text-lg text-slate-600"
          >
            EcoFocus enriches your existing datasets with validated sustainability attitudes, behaviors, and
            psychographics—delivering the missing dimension your teams need to accelerate decision-making.
          </motion.p>
        </div>

        {/* Benefit strip */}
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Benchmark alignment
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Persona & modeling enrichment
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Executive-ready insights
          </span>
        </div>

        {/* Pricing columns */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cols.map((c, i) => (
            <motion.div
              key={c.title}
              initial={r ? false : { opacity: 0, y: 8 }}
              whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.06 * i }}
              className={`relative p-[1px] rounded-[1.05rem]
                ${c.highlight
                  ? 'bg-[linear-gradient(135deg,rgba(248,184,74,0.6),rgba(16,185,129,0.45),rgba(59,130,246,0.35))]'
                  : 'bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]'}
              `}
            >
              <article
                className="h-full rounded-[1rem] bg-white ring-1 ring-gray-100
                  shadow-[0_10px_28px_-6px_rgba(0,0,0,0.10)]
                  hover:shadow-[0_18px_44px_-12px_rgba(0,0,0,0.18)]
                  transition flex flex-col"
              >
                {/* Ribbon */}
                {c.highlight && c.ribbon ? (
                  <div className="absolute -top-3 left-4">
                    <span className="inline-flex items-center rounded-full bg-[#ef9601] px-3 py-1 text-[10px] font-semibold text-white shadow">
                      {c.ribbon}
                    </span>
                  </div>
                ) : null}

                {/* Header */}
                <div className="px-6 pt-7 pb-4">
                  <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-slate-900 leading-snug">
                    {c.title}
                  </h3>
                </div>

                {/* List */}
                <div className="px-6 pb-6">
                  <ul className="grid gap-2">
                    {c.lines.map((l) => (
                      <li key={l} className="flex items-start gap-3 text-[15px] text-slate-700 leading-relaxed">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-6 pt-1 pb-6 mt-auto">
                  {c.highlight ? (
                    <>
                      <Link
                        href="/contact"
                        className="inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:translate-y-[1px] transition"
                      >
                        Contact us to start
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/contact"
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                    >
                      Talk to us
                    </Link>
                  )}
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* soft divider */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}
