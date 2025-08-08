'use client';

import { motion, Variants } from 'framer-motion';
import { Microscope, BarChart3, Brain, Target, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Step = {
  label: string;
  sub: string;
  icon: React.ElementType;
  gradient: string; // Tailwind gradient classes
};

const STEPS: Step[] = [
  {
    label: 'Market Research',
    sub: 'Syndicated & custom studies uncover real attitudes and drivers.',
    icon: Microscope,
    gradient: 'from-emerald-700 to-emerald-500',
  },
  {
    label: 'Data',
    sub: 'Validated, census-balanced data with rigorous methodology.',
    icon: BarChart3,
    gradient: 'from-[#00767a] to-[#2C7FB8]',
  },
  {
    label: 'Knowledge',
    sub: 'Insights that separate intent from action—the say–do gap.',
    icon: Brain,
    gradient: 'from-[#dd9e37] to-[#FFC107]',
  },
  {
    label: 'Informed Decisions',
    sub: 'Clear moves for product, packaging, and go‑to‑market.',
    icon: Target,
    gradient: 'from-[#0f5132] to-[#56a96f]',
  },
];

const container: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      // Use a cubic-bezier to satisfy TS types
      ease: [0.22, 1, 0.36, 1],
      duration: 0.5,
      staggerChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ease: [0.22, 1, 0.36, 1],
      duration: 0.5,
    },
  },
};

export default function DominoValueChain() {
  return (
    <section aria-labelledby="domino-value-chain" className="relative py-20 bg-white">
      {/* soft background wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-amber-50/40 via-emerald-50/40 to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <motion.h2
            id="domino-value-chain"
            className="text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            From{' '}
            <span className="bg-clip-text text-transparent bg-[length:200%_200%] bg-gradient-to-r from-[#dd9e37] via-[#FFC107] to-[#dd803e] animate-[gradientMove_8s_ease_infinite]">
              Research
            </span>{' '}
            to Action
          </motion.h2>
          <motion.p
            className="text-gray-600 mt-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            MARKET RESEARCH = DATA → DATA = KNOWLEDGE → KNOWLEDGE = INFORMED DECISIONS
          </motion.p>
        </div>

        {/* Domino chain */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20% 0px -10% 0px' }}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-6"
        >
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isLast = idx === STEPS.length - 1;

            return (
              <div key={s.label} className="flex-1">
                <motion.div variants={item} className="group relative h-full">
                  {/* tile */}
                  <div className="h-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    {/* gradient header */}
                    <div className={`relative px-5 py-4 bg-gradient-to-r ${s.gradient} text-white`}>
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-sm">
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div className="text-base md:text-lg font-semibold">{s.label}</div>
                      </div>

                      {/* animated shimmer stripe */}
                      <motion.div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/30"
                        initial={{ x: '-100%' }}
                        whileInView={{ x: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, repeat: Infinity, repeatType: 'loop', ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          background:
                            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 50%, rgba(255,255,255,0) 100%)',
                        }}
                      />
                    </div>

                    {/* body */}
                    <div className="p-5">
                      <p className="text-sm text-gray-700">{s.sub}</p>
                    </div>

                    {/* hover reveal */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-emerald-300/70 transition" />
                  </div>

                  {/* connector arrow (desktop only) */}
                  {!isLast && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="hidden md:flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <ChevronRight className="w-8 h-8 text-emerald-700/70 md:mt-4" />
                    </motion.div>
                  )}
                </motion.div>

                {/* connector arrow for mobile (vertical) */}
                {!isLast && (
                  <div className="md:hidden flex justify-center" aria-hidden="true">
                    <ChevronRight className="rotate-90 w-6 h-6 text-emerald-700/60" />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Optional CTA row */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Link
            href="/solutions"
            className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#124734] hover:opacity-95 transition"
          >
            Explore Solutions
          </Link>
          <Link
            href="/reports/latest"
            className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-neutral-900 bg-[#dd9e37] hover:opacity-95 transition"
          >
            View Latest Report
          </Link>
        </div>
      </div>

      {/* keyframes for the animated gradient in the heading */}
      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}

