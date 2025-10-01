// app/components/QuickStats.tsx
'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Stat = {
  label: string;
  value: string;
  icon: string;
  theme: 'emerald' | 'slate' | 'marigold';
};

const THEMES: Record<
  Stat['theme'],
  {
    panel: string;       // card bg (can be gradient)
    ring: string;        // subtle ring/border
    value: string;       // value color
    label: string;       // label color
    iconWrap: string;    // icon container
    icon: string;        // icon color
  }
> = {
  emerald: {
    panel:
      'bg-gradient-to-br from-emerald-600 to-emerald-700',
    ring: 'ring-emerald-500/30',
    value: 'text-white',
    label: 'text-emerald-50/95',
    iconWrap: 'bg-emerald-500/25 ring-1 ring-emerald-300/40',
    icon: 'text-white',
  },
  slate: {
    panel:
      'bg-gradient-to-br from-[#0F1A28] to-[#0B1320]',
    ring: 'ring-white/15',
    value: 'text-white',
    label: 'text-slate-200/90',
    iconWrap: 'bg-white/10 ring-1 ring-white/20',
    icon: 'text-white',
  },
  marigold: {
    panel:
      'bg-gradient-to-br from-[#F8B84A] to-[#EF9601]',
    ring: 'ring-[#b26d00]/25',
    value: 'text-slate-900',
    label: 'text-slate-900/80',
    iconWrap: 'bg-white/60 ring-1 ring-white/70',
    icon: 'text-slate-900',
  },
};

export default function QuickStats() {
  const reduce = useReducedMotion();

  const [stats, setStats] = React.useState<Stat[]>([
    { label: 'Years of Trend Data', value: '13+', icon: 'ri-bar-chart-2-line', theme: 'emerald' },
    { label: 'Data Points Collected', value: '90,000+', icon: 'ri-database-2-line', theme: 'slate' },
    { label: 'U.S. Respondents (Annually)', value: '4,000+', icon: 'ri-percent-line', theme: 'marigold' },
  ]);

  // Auto-reshuffle gently every 7s (disabled if user prefers reduced motion)
  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setStats((arr) => {
        // simple rotation preserves color mapping predictably
        const [first, ...rest] = arr;
        return [...rest, first];
      });
    }, 7000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section aria-labelledby="quick-stats-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <h2 id="quick-stats-heading" className="sr-only">
          Quick Stats
        </h2>

        {/* layout container enables position animation on reorder */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {stats.map((stat, i) => {
            const t = THEMES[stat.theme];
            return (
              <motion.div
                key={stat.label}
                layout
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.7, delay: i * 0.06 }}
                className={`relative rounded-2xl ring-1 ${t.ring} ${t.panel} shadow-[0_18px_44px_-18px_rgba(3,10,20,.45)]`}
                style={{ willChange: 'transform' }}
                whileHover={reduce ? {} : { y: -4 }}
              >
                {/* subtle diagonal sheen on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      'linear-gradient(100deg,transparent 35%,rgba(255,255,255,.18) 50%,transparent 70%)',
                  }}
                />

                <div className="relative z-10 px-5 py-6 sm:px-6 sm:py-7 flex items-center sm:block gap-4">
                  {/* Icon */}
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${t.iconWrap}`}
                    aria-hidden="true"
                  >
                    <i className={`${stat.icon} text-2xl ${t.icon}`} />
                  </span>

                  {/* Value + label */}
                  <div className="min-w-0">
                    <div className={`mt-0 sm:mt-3 text-3xl sm:text-4xl font-semibold tracking-tight ${t.value}`}>
                      {stat.value}
                    </div>
                    <div className={`mt-1 text-sm sm:text-base ${t.label}`}>{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* tiny divider for polish */}
        <div className="mt-10 sm:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}








