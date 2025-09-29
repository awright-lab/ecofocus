'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

/* ================ Ultra-smooth Data Waves ================ */
function DataWaves({
  colors = ['#213F97', '#10B981', '#EF9601'], // slate blue, emerald, marigold
  bars = 14,
  maxWidth = 480,
  gutter = 10,
  spacing = 22,
  barWidth = 9,
  barHeight = 56,
  duration = 3.0,
  delayStep = 0.16,
  offsetX = 4,
  reflectionOpacity = 0.42,
  reflectionBlurPx = 2,
}: {
  colors?: string[];
  bars?: number;
  maxWidth?: number;
  gutter?: number;
  spacing?: number;
  barWidth?: number;
  barHeight?: number;
  duration?: number;
  delayStep?: number;
  offsetX?: number;
  reflectionOpacity?: number;
  reflectionBlurPx?: number;
}) {
  const colorAt = (i: number) => colors[i % colors.length];

  return (
    <div
      className="waves mx-auto"
      aria-hidden
      style={{
        maxWidth,
        transform: `translateX(${offsetX}px)`,
        ['--gutter' as any]: `${gutter}px`,
        ['--spacing' as any]: `${spacing}px`,
        ['--barW' as any]: `${barWidth}px`,
        ['--barH' as any]: `${barHeight}px`,
        ['--dur' as any]: `${duration}s`,
        ['--delayStep' as any]: `${delayStep}s`,
        ['--reflOpacity' as any]: reflectionOpacity,
        ['--reflBlur' as any]: `${reflectionBlurPx}px`,
      }}
    >
      <div className="row top">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={`t-${i}`}
            className="bar"
            style={{
              left: `calc(var(--gutter) + ${(i + 1)} * var(--spacing))`,
              animationDelay: `calc(${i + 1} * var(--delayStep))`,
              background: `linear-gradient(180deg, ${colorAt(i)} 0%, ${colorAt(i)} 70%, rgba(255,255,255,0.18) 100%)`,
              boxShadow: `0 6px 18px -8px ${colorAt(i)}33`,
            }}
          />
        ))}
      </div>

      <div className="axis" />

      <div className="row bottom">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={`b-${i}`}
            className="bar"
            style={{
              left: `calc(var(--gutter) + ${(i + 1)} * var(--spacing))`,
              animationDelay: `calc(${i + 1} * var(--delayStep))`,
              background: `linear-gradient(180deg, ${colorAt(i)} 0%, ${colorAt(i)} 70%, rgba(255,255,255,0.18) 100%)`,
              boxShadow: `0 6px 18px -8px ${colorAt(i)}33`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .waves { width: 100%; position: relative; }
        .row   { position: relative; height: calc(var(--barH) + 24px); width: 100%; }
        .row.bottom { transform: rotate(180deg); opacity: var(--reflOpacity); filter: blur(var(--reflBlur)); }
        .axis  { height: 2px; width: 100%; background: #213f97; opacity: 0.85; }

        .bar {
          position: absolute;
          bottom: 20px;
          width: var(--barW);
          height: var(--barH);
          border-radius: 999px;
          transform-origin: bottom;
          transform: translateX(0) translateY(2px) scaleY(0);
          animation-name: waveMotion;
          animation-duration: var(--dur);
          animation-timing-function: cubic-bezier(0.33, 0.0, 0.23, 1);
          animation-iteration-count: infinite;
          will-change: transform;
          backface-visibility: hidden;
        }

        @keyframes waveMotion {
          0%   { transform: translateX(0)              translateY(2px) scaleY(0.02); }
          45%  { transform: translateX(0)              translateY(0)    scaleY(1.0); }
          100% { transform: translateX(var(--spacing)) translateY(2px) scaleY(0.02); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bar { animation: none; transform: translateX(0) translateY(1px) scaleY(0.5); }
        }

        @media (max-width: 480px) {
          .row { height: calc(var(--barH) + 16px); }
        }
      `}</style>
    </div>
  );
}

/* ==================== About: Who We Are ==================== */
export default function AboutWhoWeAre() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="about-who-heading" className="relative bg-white overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch"
          style={{ ['--stack-h' as any]: '26rem' } as React.CSSProperties}
        >
          {/* Left: eyebrow + title + waves (matches homepage vibe) */}
          <div className="md:col-span-5 flex flex-col justify-center md:min-h-[var(--stack-h)]">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-5"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-black/60">Who We Are</span>
              </span>
            </motion.div>

            <h2
              id="about-who-heading"
              className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4vw,2.6rem)]"
            >
              Shaping tomorrow with <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">sustainable insights</span>
            </h2>

            <div className="mt-4 md:mt-5">
              <DataWaves
                colors={['#213F97', '#10B981', '#EF9601']}
                bars={14}
                maxWidth={460}
                gutter={10}
                spacing={22}
                barWidth={9}
                barHeight={56}
                duration={3.0}
                delayStep={0.16}
                offsetX={4}
                reflectionOpacity={0.42}
                reflectionBlurPx={2}
              />
            </div>
          </div>

          {/* Right: layered image + copy card */}
          <div className="md:col-span-7 relative md:min-h-[var(--stack-h)]">
            <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
              <div className="relative h-72 md:h-[var(--stack-h)] w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about-bg.png" /* TODO: replace with on-brand asset */
                  alt="EcoFocus sustainability research"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 md:-left-12 translate-y-1/3 md:translate-y-1/4 w-[90%] md:w-[70%]">
              <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 p-6 md:p-8">
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Since 2010, EcoFocus Research has studied how U.S. consumers think about sustainability
                  —and how beliefs turn into choices. We translate signals into strategy so your team
                  can earn trust, close the say–do gap, and grow with purpose.
                </p>
                <ul className="mt-4 grid gap-2 text-slate-700 text-sm">
                  <li className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-amber-400" /> Evidence-based, human-centered research</li>
                  <li className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-amber-400" /> Clear frameworks to move from intent to action</li>
                  <li className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-amber-400" /> Practical recommendations aligned to your category</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* subtle divider like homepage */}
        <div className="mt-10 md:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}


