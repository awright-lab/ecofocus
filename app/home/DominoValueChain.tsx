'use client';

import { useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { Microscope, BarChart3, Brain, Target, ChevronRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import React from 'react';

type Step = {
  label: string;
  sub: string;
  icon: React.ElementType;
  gradient: string;
};

const STEPS: Step[] = [
  {
    label: 'Market Research',
    sub: 'Independent studies that reveal real attitudes and behaviors—beyond assumptions, straight to what drives action.',
    icon: Microscope,
    gradient: 'from-emerald-700 to-emerald-500',
  },
  {
    label: 'Data',
    sub: 'Census-balanced, statistically rigorous insights that spot shifts and opportunities with precision.',
    icon: BarChart3,
    gradient: 'from-[#00767a] to-[#2C7FB8]',
  },
  {
    label: 'Knowledge',
    sub: 'Insights that transform numbers into clarity, context, and strategies you can act on today.',
    icon: Brain,
    gradient: 'from-[#dd9e37] to-[#FFC107]',
  },
  {
    label: 'Informed Decisions',
    sub: 'Confidently shape products, packaging, and strategy with data aligned to consumer expectations.',
    icon: Target,
    gradient: 'from-[#0f5132] to-[#56a96f]',
  },
];

/**
 * Keyframes to simulate a topple:
 * - start upright
 * - tip forward
 * - overshoot slightly
 * - settle
 */
const toppleKeyframes = {
  rotate: [0, -12, -16, -10, 0],
  x: [0, 4, 6, 2, 0],
  y: [0, 0, 1, 0, 0],
};

//const easeBezier: number[] = [0.22, 1, 0.36, 1]; // nice "out" feel

const cardVariants: Variants = {
  initial: { opacity: 0, rotate: 0, x: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    rotate: toppleKeyframes.rotate,
    x: toppleKeyframes.x,
    y: toppleKeyframes.y,
    transition: {
      delay: i * 0.18, // domino delay
      duration: 0.9,
      ease: [0.68, -0.55, 0.27, 1.55]
    },
  }),
};

export default function DominoValueChain() {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.25, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

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
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            From{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Research
          </span>{' '}
            to Action
          </motion.h2>

          <motion.p
            className="text-gray-600 mt-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            From attitudes to actions, we deliver the evidence leaders need to make bold, informed moves.
          </motion.p>
        </div>

        {/* Domino chain */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch"
        >
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isLast = idx === STEPS.length - 1;

            return (
              <motion.div
                key={s.label}
                className="relative"
                custom={idx}
                variants={cardVariants}
                initial="initial"
                animate={controls}
                // little hover micro-wobble
                whileHover={{ rotate: -3, x: 2, transition: { duration: 0.25, ease: [0.68, -0.55, 0.27, 1.55] as [number, number, number, number]  } }}
                style={{ transformOrigin: 'left center' }}
              >
                <div className="h-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  {/* gradient header */}
                  <div className={`relative px-5 py-4 bg-gradient-to-r ${s.gradient} text-white`}>
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-sm">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="text-base md:text-lg font-semibold">{s.label}</div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-white/30" />
                  </div>

                  {/* body */}
                  <div className="p-5">
                    <p className="text-sm text-gray-700">{s.sub}</p>
                  </div>

                  <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent hover:ring-emerald-300/70 transition" />
                </div>

                {/* connector arrow (desktop only) */}
                {!isLast && (
                  <div className="hidden md:block" aria-hidden="true">
                    <ChevronRight className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 text-emerald-700/70" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA row */}
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
    </section>
  );
}

