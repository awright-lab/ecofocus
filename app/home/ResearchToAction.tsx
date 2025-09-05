// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decisions'];

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true, // set to false to force animation even if the OS prefers reduced motion
}: {
  theme?: Theme;
  respectMotion?: boolean;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  // create enough chips for a nice stream
  const CHIP_COUNT = 8;
  const chips = Array.from({ length: CHIP_COUNT }, (_, i) => i);

  return (
    <section
      className={[
        'relative isolate overflow-hidden',
        theme === 'dark' ? 'bg-neutral-950' : 'bg-white',
      ].join(' ')}
      // Expose timing tokens on the host so children can always read them
      style={
        {
          ['--belt-speed' as any]: '12s',     // how long a chip takes to cross the belt
          ['--cycle-speed' as any]: '12s',    // word-morph cycle; keep equal to belt for 25% = quarter distance
          ['--line-speed' as any]: '1.6s',    // dashed line scroll
          ['--wheel-speed' as any]: '2.5s',   // wheel spin
          ['--chip-stagger' as any]: '0.8s',  // phase offset between chips for the word-morph
        } as React.CSSProperties
      }
    >
      {/* ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl bg-emerald-600/20" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl bg-sky-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(16,185,129,0.18),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="text-center">
          <p
            className={[
              'text-xs tracking-wider uppercase mb-6',
              theme === 'dark' ? 'text-white/60' : 'text-neutral-600',
            ].join(' ')}
          >
            From Research to Action
          </p>
        </div>

        {/* Conveyor scene */}
        <div className="relative mx-auto h-40 sm:h-44 md:h-48">
          {/* belt with slight perspective */}
          <div
            className="absolute inset-x-0"
            style={{
              top: '52%',
              transform: 'translateY(-50%) perspective(800px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* top surface */}
            <div
              className="belt-top relative h-9 sm:h-10 md:h-11 rounded-md overflow-hidden shadow-lg"
              style={{ transform: 'translateZ(0)' }}
            >
              <span
                className="belt-line absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px]"
                style={reduce ? { animation: 'none' } : undefined}
              />
              <span className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply belt-grain" />
            </div>

            {/* side face */}
            <div
              className="belt-side h-4 sm:h-4.5 md:h-5 rounded-b-md"
              style={{
                transform: 'translateY(-2px) rotateX(35deg)',
                transformOrigin: 'top center',
                boxShadow:
                  theme === 'dark'
                    ? '0 10px 20px rgba(0,0,0,.35)'
                    : '0 10px 20px rgba(0,0,0,.12)',
              }}
            />

            {/* wheels */}
            <div className="absolute inset-x-0 -bottom-7 flex items-end justify-between px-6 sm:px-10 md:px-14">
              {[0, 1, 2, 3].map((i) => (
                <Wheel key={i} dark={theme === 'dark'} reduce={reduce} />
              ))}
            </div>
          </div>

          {/* Chips that morph text while traveling */}
          <ul
            className="absolute left-0 right-0 z-10 flex items-center gap-6 sm:gap-8 md:gap-10"
            style={{ bottom: 'calc(50% + 1.25rem)' }}
            aria-hidden="true"
          >
            {chips.map((i) => (
              <li
                key={i}
                className={['chip', chipVariantForIndex(i)].join(' ')}
                // movement delay; also feeds morph phase via --i
                style={
                  reduce
                    ? { animation: 'none' }
                    : ({ ['--i' as any]: String(i) } as React.CSSProperties)
                }
              >
                {/* We stack four labels and animate their visibility in sequence */}
                <span className="w w1">{WORDS[0]}</span>
                <span className="w w2">{WORDS[1]}</span>
                <span className="w w3">{WORDS[2]}</span>
                <span className="w w4">{WORDS[3]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* styles */}
      <style jsx>{`
        /* tokens */
        :root {
          --ef-emerald: #0c8a6a;
          --ef-teal: #2c7fb8;
          --ef-gold: #dd9e37;

          --ef-ink: #0f172a;
          --ef-ink-70: rgba(15, 23, 42, 0.7);
          --ef-ink-40: rgba(15, 23, 42, 0.4);
          --ef-paper: #ffffff;
          --ef-paper-2: #f6f8fb;

          --ef-elev-1: 0 6px 16px rgba(0, 0, 0, 0.08),
            inset 0 1px rgba(255, 255, 255, 0.7);
          --ef-elev-1-dark: 0 6px 18px rgba(0, 0, 0, 0.35),
            inset 0 1px rgba(255, 255, 255, 0.05);
        }

        /* belt paint */
        .belt-top {
          background: linear-gradient(180deg, #e9f6f0 0%, #dff3ec 100%);
          position: relative;
        }
        .belt-side {
          background: linear-gradient(180deg, #cfe8f7 0%, #bddff3 100%);
        }
        .belt-line {
          background-image: repeating-linear-gradient(
            90deg,
            rgba(44, 127, 184, 0.9) 0 16px,
            transparent 16px 32px
          );
          background-size: 48px 2px;
          animation-name: lineScroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--line-speed, 1.6s);
          opacity: 0.45;
        }
        .belt-grain {
          background: radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px) 0 0 /
            6px 6px;
        }

        /* light theme tweaks */
        :global(section.bg-white) .belt-top {
          background: linear-gradient(180deg, #f3faf6 0%, #ecf7f2 100%);
        }
        :global(section.bg-white) .belt-side {
          background: linear-gradient(180deg, #eaf4fb 0%, #dff0fa 100%);
        }

        /* chip shell */
        .chip {
          position: relative;
          font: 600 14px/1.1 Inter, system-ui, -apple-system, Segoe UI, Roboto,
            sans-serif;
          padding: 6px 12px;
          border-radius: 999px;
          white-space: nowrap;
          color: var(--ef-ink);
          background: linear-gradient(
            180deg,
            var(--ef-paper) 0%,
            var(--ef-paper-2) 100%
          );
          border: 1px solid var(--ef-ink-40);
          box-shadow: var(--ef-elev-1);
          will-change: transform;
          /* travel across belt */
          animation-name: beltTravel;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--belt-speed, 12s);
          animation-delay: calc(var(--i) * -1.5s);
          /* local var used by word morph to stagger chips */
          --chip-phase: calc(var(--chip-stagger, 0.8s) * var(--i));
          overflow: hidden;
        }
        :global(section.bg-neutral-950) .chip {
          color: #e5e7eb;
          background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: var(--ef-elev-1-dark);
        }
        .chip--emerald-soft {
          background: linear-gradient(
            180deg,
            rgba(12, 138, 106, 0.12) 0%,
            rgba(12, 138, 106, 0.04) 100%
          );
          border-color: rgba(12, 138, 106, 0.35);
        }
        .chip--teal-soft {
          background: linear-gradient(
            180deg,
            rgba(44, 127, 184, 0.12) 0%,
            rgba(44, 127, 184, 0.04) 100%
          );
          border-color: rgba(44, 127, 184, 0.35);
        }
        .chip--outline {
          background: transparent;
          border-style: dashed;
          color: var(--ef-ink-70);
        }
        .chip--gold-solid {
          background: linear-gradient(180deg, #f0b34e 0%, var(--ef-gold) 100%);
          color: #1a1304;
          border-color: transparent;
          box-shadow: 0 0 0 1px rgba(221, 158, 55, 0.25) inset,
            0 6px 16px rgba(221, 158, 55, 0.18);
        }

        /* stacked labels inside each chip */
        .w {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px; /* match chip horizontal padding so text stays centered */
          opacity: 0;
          transform: translateY(6px);
          /* single keyframes; we stagger each label with delays so it owns a 25% window */
          animation-name: wordWindow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--cycle-speed, 12s);
        }
        /* Show each word for ~25% with a tiny crossfade; the negative delays align phases */
        .w1 {
          animation-delay: calc(0s - var(--chip-phase));
        }
        .w2 {
          animation-delay: calc((var(--cycle-speed, 12s) * -0.25) - var(--chip-phase));
        }
        .w3 {
          animation-delay: calc((var(--cycle-speed, 12s) * -0.5) - var(--chip-phase));
        }
        .w4 {
          animation-delay: calc((var(--cycle-speed, 12s) * -0.75) - var(--chip-phase));
        }

        /* keyframes */
        @keyframes beltTravel {
          from {
            transform: translateX(-120%);
          }
          to {
            transform: translateX(120%);
          }
        }
        @keyframes lineScroll {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 48px 0;
          }
        }
        /* Each label is visible for ~20% of the cycle with a brief fade in/out */
        @keyframes wordWindow {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          4% {
            opacity: 1;
            transform: translateY(0);
          }
          22% {
            opacity: 1;
            transform: translateY(0);
          }
          26% {
            opacity: 0;
            transform: translateY(-6px);
          }
          100% {
            opacity: 0;
            transform: translateY(-6px);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .chip,
          .w,
          .belt-line {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function Wheel({ dark, reduce }: { dark: boolean; reduce: boolean }) {
  return (
    <div
      aria-hidden
      className={[
        'relative h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full',
        dark ? 'bg-neutral-800' : 'bg-neutral-200',
      ].join(' ')}
      style={{
        boxShadow: dark
          ? 'inset 0 2px 6px rgba(255,255,255,.08)'
          : 'inset 0 2px 6px rgba(0,0,0,.15)',
      }}
    >
      <span
        className="absolute inset-1 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, rgba(255,255,255,.18), transparent 35%), radial-gradient(circle at 70% 70%, rgba(0,0,0,.18), transparent 40%)',
          ...(reduce
            ? {}
            : {
                animationName: 'spin',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDuration: 'var(--wheel-speed, 2.5s)',
              }),
        }}
      />
    </div>
  );
}

/* rotate chip visual variants for rhythm */
function chipVariantForIndex(i: number) {
  const mod = i % 4;
  if (mod === 0) return 'chip--emerald-soft';
  if (mod === 1) return 'chip--teal-soft';
  if (mod === 2) return 'chip--outline';
  return 'chip--gold-solid';
}





