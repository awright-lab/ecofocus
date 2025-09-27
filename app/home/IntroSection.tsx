// app/components/IntroSection.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';

export default function IntroSection() {
  return (
    <section
      aria-labelledby="intro-heading"
      className="relative bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 md:py-16">
        {/* Eyebrow */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
          <span className="text-emerald-700 font-medium">Intro</span>
        </div>

        {/* Headline + Subhead (½ width headline on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-5 md:gap-6">
          <h2
            id="intro-heading"
            className="md:col-span-6 font-bold leading-tight text-slate-900 text-[clamp(1.6rem,4.2vw,2.25rem)] md:text-[clamp(1.9rem,3.4vw,2.5rem)]"
          >
            Trusted Insights for Purpose-Driven <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">Growth</span>
          </h2>
          <p className="md:col-span-6 text-base md:text-lg text-slate-600">
            For over 13 years, EcoFocus has tracked how sustainability shapes consumer decisions.
            We help brands and agencies turn credible consumer data into strategies that resonate,
            perform, and prove ROI.
          </p>
        </div>

        {/* Three quick “what we do” points */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Point
            icon="ri-bar-chart-2-line"
            title="Annual Syndicated Study"
            text="Census-balanced U.S. sample with ~±1.55% MoE, delivered via an interactive dashboard."
          />
          <Point
            icon="ri-database-2-line"
            title="Data Integration"
            text="Fuse EcoFocus signals with your datasets to sharpen personas and models."
          />
          <Point
            icon="ri-flask-line"
            title="Custom Studies"
            text="Answer the questions only your brand can ask—quant, qual, and executive-ready outputs."
          />
        </div>

        {/* CTA row */}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/benefits"
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition"
          >
            See how it works
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-slate-300 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-900 transition"
          >
            Talk to our team
          </Link>
        </div>
      </div>
    </section>
  );
}

function Point({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <i aria-hidden className={`${icon} text-emerald-600 text-xl mt-0.5`} />
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
