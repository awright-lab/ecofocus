'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Theme = 'emerald' | 'slate' | 'sunrise';

const THEMES: Record<
  Theme,
  {
    panel: string;
    ring: string;
    iconWrap: string;
    icon: string;
    value: string;
    body: string;
  }
> = {
  emerald: {
    panel: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
    ring: 'ring-emerald-400/40',
    iconWrap: 'bg-emerald-500/25 ring-1 ring-emerald-300/40 text-white',
    icon: 'text-white',
    value: 'text-white',
    body: 'text-emerald-50/90',
  },
  slate: {
    panel: 'bg-gradient-to-br from-[#0F1A2B] to-[#091121]',
    ring: 'ring-white/15',
    iconWrap: 'bg-white/15 ring-1 ring-white/30 text-white',
    icon: 'text-white',
    value: 'text-white',
    body: 'text-slate-200/90',
  },
  sunrise: {
    panel: 'bg-gradient-to-br from-[#F8B84A] to-[#EF9601]',
    ring: 'ring-[#b26d00]/30',
    iconWrap: 'bg-white/70 ring-1 ring-white/80 text-slate-900',
    icon: 'text-slate-900',
    value: 'text-slate-900',
    body: 'text-slate-900/90',
  },
};

const stats = [
  {
    value: '4,000',
    label: 'Respondents per wave',
    body: 'U.S. adults 18+, balanced to current Census targets with multilingual support.',
    icon: 'ri-group-line',
    theme: 'emerald' as Theme,
  },
  {
    value: '13 yrs',
    label: 'Continuous trendline',
    body: 'Annual study since 2010 capturing the same core KPIs for reliable change detection.',
    icon: 'ri-timer-flash-line',
    theme: 'slate' as Theme,
  },
  {
    value: '±1.55%',
    label: 'National MoE',
    body: 'At the 95% confidence level; module-level precision noted inside the dashboard.',
    icon: 'ri-equalizer-line',
    theme: 'sunrise' as Theme,
  },
  {
    value: '50+',
    label: 'Sustainability modules',
    body: 'Behaviors, segmentation, claims, and say/do gaps designed for activation.',
    icon: 'ri-stack-line',
    theme: 'emerald' as Theme,
  },
];

export default function DashboardMethodology() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="dash-methodology">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center">
          <motion.h2
            id="dash-methodology"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.4rem)]"
          >
            Scalable Data You Can Trust
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mx-auto mt-4 max-w-3xl text-base text-slate-600"
          >
            Our syndicated sustainability study is the backbone of the dashboard—so you get credible, decision-ready
            insight with the same palette and polish as our syndicated study experience.
          </motion.p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const theme = THEMES[stat.theme];
            return (
              <motion.article
                key={stat.label}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className={`relative rounded-2xl ${theme.panel} p-6 sm:p-7 ring-1 ${theme.ring} shadow-[0_18px_44px_-18px_rgba(3,10,20,0.65)]`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity"
                  style={{
                    background:
                      'linear-gradient(120deg,transparent 40%,rgba(255,255,255,0.2) 55%,transparent 70%)',
                  }}
                />

                <div className="relative z-10 flex items-center gap-4">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${theme.iconWrap}`}>
                    <i className={`${stat.icon} text-2xl ${theme.icon}`} aria-hidden="true" />
                  </span>
                  <div>
                    <div className={`text-3xl font-semibold tracking-tight ${theme.value}`}>{stat.value}</div>
                    <p className={`text-sm font-medium ${theme.body}`}>{stat.label}</p>
                  </div>
                </div>
                <p className={`relative z-10 mt-4 text-sm leading-relaxed ${theme.body}`}>{stat.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
