// app/components/IntroSection.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';

/* ===================== Sleek Data Waves ===================== */
function DataWaves({
  colors = ['#213F97', '#10B981', '#EF9601'], // slate blue, emerald, marigold
  bars = 14,          // total bars per row
  maxWidth = 480,     // narrower, centered presentation
  gutter = 10,        // inner left padding
  spacing = 22,       // distance between bars
  height = 56,        // max bar height
  baseDuration = 2.6, // slower overall rhythm (seconds)
  offsetX = 4,        // tiny nudge to the right
  reflectionOpacity = 0.45,
  reflectionBlurPx = 2,
}: {
  colors?: string[];
  bars?: number;
  maxWidth?: number;
  gutter?: number;
  spacing?: number;
  height?: number;
  baseDuration?: number;
  offsetX?: number;
  reflectionOpacity?: number;
  reflectionBlurPx?: number;
}) {
  const colorAt = (i: number) => colors[i % colors.length];

  // A slightly randomized duration per bar keeps things organic (but subtle).
  const dur = (i: number) => (baseDuration + (i % 3) * 0.18).toFixed(2); // 2.6 → 3.0s
  const delay = (i: number) => ((i + 1) * 0.16).toFixed(2);              // stagger

  return (
    <div
      className="waves mx-auto"
      aria-hidden
      style={{
        maxWidth,
        transform: `translateX(${offsetX}px)`,
        ['--gutter' as any]: `${gutter}px`,
        ['--spacing' as any]: `${spacing}px`,
        ['--barH' as any]: `${height}px`,
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
              animationDelay: `${delay(i)}s`,
              animationDuration: `${dur(i)}s`,
              // polished bar: subtle vertical highlight via gradient
              background: `linear-gradient(180deg, ${colorAt(i)} 0%, ${colorAt(i)} 70%, rgba(255,255,255,0.22) 100%)`,
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
              animationDelay: `${delay(i)}s`,
              animationDuration: `${dur(i)}s`,
              background: `linear-gradient(180deg, ${colorAt(i)} 0%, ${colorAt(i)} 70%, rgba(255,255,255,0.22) 100%)`,
              boxShadow: `0 6px 18px -8px ${colorAt(i)}33`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .waves {
          width: 100%;
          position: relative;
        }
        .row {
          position: relative;
          height: calc(var(--barH) + 24px);
          width: 100%;
        }
        .row.bottom {
          transform: rotate(180deg);
          opacity: var(--reflOpacity);
          filter: blur(var(--reflBlur));
        }
        .axis {
          height: 2px;
          width: 100%;
          background: #213f97;
          opacity: 0.85;
        }
        .bar {
          position: absolute;
          bottom: 20px;
          width: 9px;
          height: 0px;
          border-radius: 999px;
          animation-name: growShrink;
          animation-timing-function: cubic-bezier(0.33, 0.0, 0.23, 1); /* sleek ease */
          animation-iteration-count: infinite;
          will-change: transform, height;
        }
        @keyframes growShrink {
          0%   { margin-left: 0; height: 0px; transform: translateY(2px); }
          45%  { height: var(--barH); transform: translateY(0); }
          100% { margin-left: var(--spacing); height: 0px; transform: translateY(2px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bar { animation: none; height: calc(var(--barH) * 0.5); }
        }

        @media (max-width: 480px) {
          .row { height: calc(var(--barH) + 16px); }
          .bar { width: 8px; bottom: 16px; }
        }
      `}</style>
    </div>
  );
}

/* ===================== Intro Section ===================== */
export default function IntroSection() {
  return (
    <section aria-labelledby="intro-heading" className="relative bg-white overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch"
          style={
            { ['--stack-h' as any]: '26rem' } as React.CSSProperties
          }
        >
          {/* Left: eyebrow + title + waves */}
          <div className="md:col-span-5 flex flex-col justify-center md:min-h-[var(--stack-h)]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] tracking-wide self-start">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
              <span className="text-emerald-700 font-medium">About EcoFocus</span>
            </div>

            <h2
              id="intro-heading"
              className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4vw,2.6rem)]"
            >
              Trusted Insights for Purpose-Driven Growth
            </h2>

            {/* Sleek multi-color data waves under the title */}
            <div className="mt-4 md:mt-5">
              <DataWaves
                colors={['#213F97', '#10B981', '#EF9601']}
                bars={14}
                maxWidth={480}
                gutter={10}
                spacing={22}
                height={56}
                baseDuration={2.6}  // slower; raise to 2.8–3.2 for even calmer
                offsetX={4}
                reflectionOpacity={0.45}
                reflectionBlurPx={2}
              />
            </div>
          </div>

          {/* Right: layered cards (image + intro text) */}
          <div className="md:col-span-7 relative md:min-h-[var(--stack-h)]">
            <div className="relative h-72 md:h-[var(--stack-h)] w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/intro-bg.jpg" // replace with your asset
                alt="EcoFocus sustainability research"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute bottom-0 left-0 md:-left-12 translate-y-1/3 md:translate-y-1/4 w-[90%] md:w-[70%]">
              <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 p-6 md:p-8">
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                  For over 13 years, EcoFocus has tracked how sustainability shapes consumer
                  decisions. We help brands and agencies turn credible consumer data into
                  strategies that resonate, perform, and prove ROI.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Optional divider for polish */}
        <div className="mt-10 md:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}









