'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Pillar = {
  title: string;
  body: string;
  icon: string; // Remix Icon class, e.g. 'ri-line-chart-line'
  theme: 'emerald' | 'slate' | 'marigold';
};

const THEMES: Record<
  Pillar['theme'],
  {
    panel: string;    // card background
    ring: string;     // subtle ring/border
    title: string;    // title color
    body: string;     // body color
    iconWrap: string; // icon container
    icon: string;     // icon color
  }
> = {
  emerald: {
    panel: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
    ring: 'ring-emerald-500/30',
    title: 'text-white',
    body: 'text-emerald-50/95',
    iconWrap: 'bg-emerald-500/25 ring-1 ring-emerald-300/40',
    icon: 'text-white',
  },
  slate: {
    panel: 'bg-gradient-to-br from-[#0F1A28] to-[#0B1320]',
    ring: 'ring-white/15',
    title: 'text-white',
    body: 'text-slate-200/90',
    iconWrap: 'bg-white/10 ring-1 ring-white/20',
    icon: 'text-white',
  },
  marigold: {
    panel: 'bg-gradient-to-br from-[#F8B84A] to-[#EF9601]',
    ring: 'ring-[#b26d00]/25',
    title: 'text-slate-900',
    body: 'text-slate-900/80',
    iconWrap: 'bg-white/60 ring-1 ring-white/70',
    icon: 'text-slate-900',
  },
};

export default function AboutApproach() {
  const reduce = useReducedMotion();

  const pillars: Pillar[] = [
    {
      title: 'Understand Your Audience',
      body:
        'Identify who cares, why it matters, and where attitudes diverge from behaviors so you can focus on real levers.',
      icon: 'ri-user-smile-line',
      theme: 'emerald',
    },
    {
      title: 'Spot Market Shifts Early',
      body:
        'Track emerging expectations, category signals, and trust drivers before they impact your P&L.',
      icon: 'ri-line-chart-line',
      theme: 'slate',
    },
    {
      title: 'Move From Intent to Action',
      body:
        'Translate insights into product, messaging, and portfolio choices that close the say–do gap.',
      icon: 'ri-target-2-line',
      theme: 'marigold',
    },
  ];

  return (
    <section aria-labelledby="about-approach-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        {/* Eyebrow + Heading (light and consistent with homepage tone) */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span className="text-black/60">Our Approach</span>
          </span>
          <h2
            id="about-approach-heading"
            className="mt-3 font-bold leading-tight text-slate-900 text-[clamp(1.6rem,3.6vw,2.4rem)]"
          >
            From Signals to <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">Strategy</span>
          </h2>
        </div>

        {/* Card grid (mirrors QuickStats composition & motion) */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {pillars.map((p, i) => {
            const t = THEMES[p.theme];
            return (
              <motion.div
                key={p.title}
                layout
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.7, delay: i * 0.06 }}
                className={`relative rounded-2xl ring-1 ${t.ring} ${t.panel} shadow-[0_18px_44px_-18px_rgba(3,10,20,.45)]`}
                style={{ willChange: 'transform' }}
                whileHover={reduce ? {} : { y: -4 }}
              >
                {/* sheen on hover (same trick as QuickStats) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      'linear-gradient(100deg,transparent 35%,rgba(255,255,255,.18) 50%,transparent 70%)',
                  }}
                />

                <div className="relative z-10 px-5 py-6 sm:px-6 sm:py-7">
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${t.iconWrap}`} aria-hidden="true">
                      <i className={`${p.icon} text-2xl ${t.icon}`} />
                    </span>
                    <h3 className={`text-lg sm:text-xl font-semibold tracking-tight ${t.title}`}>
                      {p.title}
                    </h3>
                  </div>

                  <p className={`mt-3 text-sm sm:text-base ${t.body}`}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* subtle divider for polish (matches homepage) */}
        <div className="mt-10 sm:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}


