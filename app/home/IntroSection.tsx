// app/components/SayDoGapSection.tsx
'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

/* ====== 3-lane “Intent → Action” bridge (deterministic, GPU-only) ====== */
function GapBridge({
  colors = ['#213F97', '#10B981', '#EF9601'], // slate blue, emerald, marigold
  lanes = 3,
  maxWidth = 580,
  laneGap = 12,
  capsuleW = 22,
  capsuleH = 10,
  stream = 9,          // capsules per lane
  spacing = 26,        // horizontal spacing between capsules
  duration = 3.4,      // global duration for everyone
  delayStep = 0.22,    // stagger between capsules in a lane
}: {
  colors?: string[];
  lanes?: number;
  maxWidth?: number;
  laneGap?: number;
  capsuleW?: number;
  capsuleH?: number;
  stream?: number;
  spacing?: number;
  duration?: number;
  delayStep?: number;
}) {
  const colorAt = (i: number) => colors[i % colors.length];

  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth,
        // expose CSS custom properties
        ['--laneGap' as any]: `${laneGap}px`,
        ['--capsuleW' as any]: `${capsuleW}px`,
        ['--capsuleH' as any]: `${capsuleH}px`,
        ['--spacing' as any]: `${spacing}px`,
        ['--dur' as any]: `${duration}s`,
        ['--delayStep' as any]: `${delayStep}s`,
      }}
      aria-hidden
    >
      {/* Labels + axis */}
      <div className="relative mb-3 text-[12px] text-slate-600">
        <div className="absolute -top-2 left-0 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300" />
          Intent
        </div>
        <div className="absolute -top-2 right-0 flex items-center gap-2">
          Action
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300" />
        </div>
        <div className="h-2 w-full rounded-full bg-slate-300/25">
          <div className="h-2 w-full rounded-full bg-[#213F97]/80" />
        </div>
      </div>

      {/* Lanes */}
      <div className="relative">
        {Array.from({ length: lanes }).map((_, laneIdx) => (
          <div
            key={laneIdx}
            className="relative overflow-hidden"
            style={{ height: `calc(var(--capsuleH) + 8px)`, marginTop: laneIdx === 0 ? 0 : 'var(--laneGap)' }}
          >
            {/* edge fades for polish */}
            <span className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
            <span className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />

            {/* capsule stream */}
            {Array.from({ length: stream }).map((__, i) => (
              <span
                key={i}
                className="absolute inline-block rounded-full will-change-transform"
                style={{
                  left: `calc(${i} * var(--spacing) * -1)`, // start off-screen left
                  top: 4,
                  width: 'var(--capsuleW)',
                  height: 'var(--capsuleH)',
                  background: `linear-gradient(180deg, ${colorAt(i + laneIdx)} 0%, ${colorAt(i + laneIdx)} 70%, rgba(255,255,255,0.18) 100%)`,
                  boxShadow: `0 6px 18px -10px ${colorAt(i + laneIdx)}33`,
                  borderRadius: 999,
                  animation: `glide var(--dur) cubic-bezier(0.33,0,0.23,1) infinite`,
                  animationDelay: `calc((${i}) * var(--delayStep))`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes glide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(100% + var(--capsuleW) + 12px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="animation"] { animation: none !important; opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

/* =========================== Section =========================== */
export default function SayDoGapSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Headline */}
        <motion.h2
          className="font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
        >
          From Intent to Action: Closing the{' '}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Say–Do Gap
          </span>
        </motion.h2>

        {/* Bridge animation right under title */}
        <div className="mt-4 md:mt-5">
          <GapBridge
            colors={['#213F97', '#10B981', '#EF9601']}
            lanes={3}
            maxWidth={580}
            laneGap={12}
            capsuleW={22}
            capsuleH={10}
            stream={9}
            spacing={26}
            duration={3.4}
            delayStep={0.22}
          />
        </div>

        {/* Layout: image left with overlaid copy card (different from Intro) */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Left: image */}
          <div className="md:col-span-6 relative">
            <div className="relative h-72 md:h-[22rem] w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/say-do-gap.jpg"   // <-- replace with your asset
                alt="Consumers bridging intent and action"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Overlaid copy card (top-right corner of image) */}
            <div className="absolute right-3 top-3 md:-right-8 md:-top-6 w-[88%] md:w-[60%]">
              <div className="rounded-2xl bg-white/95 backdrop-blur-[2px] shadow-xl ring-1 ring-slate-200 p-5 md:p-6">
                <p className="text-[15px] md:text-base leading-relaxed text-slate-700">
                  The Say–Do Gap isn’t hypocrisy—it’s friction. We map where
                  intent stalls and which proof points (benefits, cues, claims)
                  actually unlock action for your audience.
                </p>
              </div>
            </div>
          </div>

          {/* Right: main body copy (for readability, not inside a card) */}
          <motion.div
            className="md:col-span-6"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <p className="text-base sm:text-[17px] leading-7 text-slate-800">
              Let’s be honest: this Say–Do Gap is one of the most frustrating
              challenges in consumer marketing. It’s tempting to dismiss it as hypocrisy—or
              dismiss sustainability as a sales driver altogether. The key to addressing it is
              first understanding what consumers are looking for—their sustainability attitudes
              and intended behaviors—and having a clear picture of how sustainability influences
              their aspirations and desires.
            </p>
            <p className="mt-4 text-base sm:text-[17px] leading-7 text-slate-800">
              At EcoFocus, we have the data (or can get the data) you need to identify
              sustainability personas for your target audience to help you build strategies—backed
              by data—to gain market share and reduce churn.{' '}
              <span className="font-semibold text-slate-900">
                Don’t speculate about your eco-minded customer. Understand them. Influence them. Win them.
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}











