'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3, Users, BadgeCheck, Layers3, BrainCog, Database, Sparkles, LineChart
} from 'lucide-react';
import { useState } from 'react';

type TabKey = 'syndicated' | 'custom' | 'infusion';

const TABS: { key: TabKey; label: string; gradient: string }[] = [
  { key: 'syndicated', label: 'Syndicated', gradient: 'from-[#00767a] to-[#2C7FB8]' },
  { key: 'custom',     label: 'Custom',     gradient: 'from-[#dd803e] to-[#FFD26F]' },
  { key: 'infusion',   label: 'Data Infusion', gradient: 'from-[#9bbd3f] to-[#56a96f]' },
];

const CONTENT: Record<TabKey, {
  bullets: { icon: JSX.Element; text: string; sub?: string }[];
  ctas: { href: string; label: string; variant?: 'primary'|'ghost' }[];
}> = {
  syndicated: {
    bullets: [
      { icon: <BarChart3 className="w-5 h-5 text-emerald-600" />, text: '90,000+ data points, refreshed annually', sub: '4,000 U.S. adults, census‑balanced, ±1.55% MoE' },
      { icon: <LineChart className="w-5 h-5 text-emerald-600" />, text: '14 years of trend tracking', sub: 'Spot shifts early across categories & cohorts' },
      { icon: <BadgeCheck className="w-5 h-5 text-emerald-600" />, text: 'Instant dashboard access', sub: 'Crosstabs, export, and ready‑made visuals' },
    ],
    ctas: [
      { href: '/demo?source=syndicated', label: 'Book a Dashboard Demo', variant: 'primary' },
      { href: '/solutions/syndicated#coverage', label: 'See Coverage' },
    ],
  },
  custom: {
    bullets: [
      { icon: <Layers3 className="w-5 h-5 text-orange-500" />, text: 'Proprietary questions in syndicated context', sub: 'Reduce bias with rich benchmarks' },
      { icon: <Users className="w-5 h-5 text-orange-500" />, text: 'Qual + quant tailored to your objectives', sub: 'B2B/B2C audiences, robust PM' },
      { icon: <BadgeCheck className="w-5 h-5 text-orange-500" />, text: 'Deliverables that travel', sub: 'Exec summary, insights, tables, dashboard access' },
    ],
    ctas: [
      { href: '/contact?type=custom-project', label: 'Start a Custom Project', variant: 'primary' },
      { href: '/work/case-studies', label: 'View Case Studies' },
    ],
  },
  infusion: {
    bullets: [
      { icon: <Database className="w-5 h-5 text-lime-600" />, text: 'Fuse our data with your own', sub: 'Enrich personas, journeys, and models' },
      { icon: <BrainCog className="w-5 h-5 text-lime-600" />, text: 'Cohort-level sustainability signals', sub: 'Gen Z, Parents, Health‑seekers, and more' },
      { icon: <Sparkles className="w-5 h-5 text-lime-600" />, text: 'Faster insights, higher ROI', sub: 'Leverage existing datasets for speed to value' },
    ],
    ctas: [
      { href: '/contact?type=data-infusion', label: 'Discuss Data Infusion', variant: 'primary' },
      { href: '/reports/latest', label: 'Read the Latest Report' },
    ],
  },
};

export default function SolutionsHighlights() {
  const [active, setActive] = useState<TabKey>('syndicated');

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Makes Our Solutions Different?
          </motion.h2>
          <p className="text-gray-600 mt-3">Clear advantages you won’t get from a generic research vendor.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition
                ${active === t.key
                  ? `text-white bg-gradient-to-r ${t.gradient} shadow`
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
              aria-pressed={active === t.key}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-12 gap-8 items-start"
            >
              {/* Bullets */}
              <div className="md:col-span-8">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <ul className="space-y-5">
                    {CONTENT[active].bullets.map((b, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="shrink-0">{b.icon}</div>
                        <div>
                          <div className="text-gray-900 font-medium">{b.text}</div>
                          {b.sub && <div className="text-sm text-gray-600">{b.sub}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Card */}
              <div className="md:col-span-4">
                <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                  <h3 className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${TABS.find(t => t.key === active)!.gradient} mb-3`}>
                    Next steps
                  </h3>
                  <p className="text-sm text-gray-600 mb-5">
                    Choose how you want to explore this solution.
                  </p>
                  <div className="flex flex-col gap-3">
                    {CONTENT[active].ctas.map((c, i) => (
                      <Link
                        key={i}
                        href={c.href}
                        className={`
                          inline-block text-center rounded-full px-5 py-2 text-sm font-semibold transition
                          ${c.variant === 'primary'
                            ? 'text-white bg-[#124734] hover:opacity-95'
                            : 'text-emerald-700 border border-emerald-200 hover:bg-emerald-50'}
                        `}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

