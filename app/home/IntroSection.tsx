// app/components/IntroSection.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';

/** Data Waves — multi-color + centered + width/offset control */
function DataWaves({
  colors = ['#213F97', '#10B981', '#EF9601'], // slate blue, emerald, marigold
  bars = 15,
  maxWidth = 520,    // << make it narrower (was 660)
  gutter = 15,       // left padding inside the waves area
  spacing = 24,      // distance between bars
  offsetX = 0,       // small global nudge (e.g., 12 to push right)
}: {
  colors?: string[];
  bars?: number;
  maxWidth?: number;
  gutter?: number;
  spacing?: number;
  offsetX?: number;
}) {
  const colorAt = (i: number) => colors[i % colors.length];

  return (
    <div
      className="waves-wrap mx-auto" // center under the title
      aria-hidden
      style={{
        maxWidth: `${maxWidth}px`,
        transform: `translateX(${offsetX}px)`,
        // expose CSS vars for the lines
        ['--gutter' as any]: `${gutter}px`,
        ['--spacing' as any]: `${spacing}px`,
      }}
    >
      <div className="row top">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={`t-${i}`}
            className="bar"
            style={{
              left: `calc(var(--gutter) + ${(i + 1)} * var(--spacing))`,
              animationDelay: `${(i + 1) / 5}s`,
              backgroundColor: colorAt(i),
            }}
          />
        ))}
      </div>

      <div className="middle" />

      <div className="row bottom">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={`b-${i}`}
            className="bar"
            style={{
              left: `calc(var(--gutter) + ${(i + 1)} * var(--spacing))`,
              animationDelay: `${(i + 1) / 5}s`,
              backgroundColor: colorAt(i),
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .waves-wrap {
          width: 100%;
          position: relative;
        }
        .row {
          position: relative;
          height: 80px;
          width: 100%;
        }
        /* Mirror the bottom row without pushing it sideways */
        .row.bottom { transform: rotate(180deg); }

        .middle {
          height: 4px;
          width: 100%;
          background-color: #213f97; /* slate blue line */
          opacity: 0.9;
        }
        .bar {
          position: absolute;
          bottom: 20px;
          width: 10px;
          height: 0px;
          border-radius: 6px;
          animation: grow-shrink 1.4s infinite ease-in-out;
          will-change: transform, height, opacity;
        }
        @keyframes grow-shrink {
          0%   { margin-left: 0; height: 0px; opacity: 1; }
          50%  {                 height: 50px; opacity: 1; }
          100% { margin-left: var(--spacing); height: 0px; opacity: 1; }
        }

        /* prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .bar { animation: none; height: 28px; }
        }

        /* Small screens */
        @media (max-width: 480px) {
          .row { height: 64px; }
          .bar { bottom: 16px; width: 8px; }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
 * Intro Section — layered image + foreground card + multi-color waves
 * =======================================================*/
export default function IntroSection() {
  return (
    <section aria-labelledby="intro-heading" className="relative bg-white overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch"
          style={
            {
              ['--stack-h' as any]: '26rem',
            } as React.CSSProperties
          }
        >
          {/* Left: eyebrow + title + waves (centered) */}
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

            {/* Centered, narrower, multi-color waves */}
            <div className="mt-4 md:mt-5">
              <DataWaves
                colors={['#213F97', '#10B981', '#EF9601']}
                bars={15}
                maxWidth={520}   // << narrow it
                gutter={12}
                spacing={22}
                offsetX={8}      // << small nudge to the right; tweak 0–16 to taste
              />
            </div>
          </div>

          {/* Right: layered cards (back image + foreground intro text) */}
          <div className="md:col-span-7 relative md:min-h-[var(--stack-h)]">
            {/* Back card: image */}
            <div className="relative h-72 md:h-[var(--stack-h)] w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/intro-bg.jpg" // replace with your asset
                alt="EcoFocus sustainability research"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Foreground card: intro text */}
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








