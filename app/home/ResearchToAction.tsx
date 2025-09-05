// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decisions'];
const LONGEST = 'Informed Decisions'; // used to reserve width per chip

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true,     // set false to force animation even if OS prefers reduced motion
  chipCount = 3,            // 1–3 recommended
  beltSpeed = '8s',         // faster by default; try '10s' if you want slower
}: {
  theme?: Theme;
  respectMotion?: boolean;
  chipCount?: number;
  beltSpeed?: string;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  // cap chipCount to 1..6 (we'll only show a few anyway)
  const COUNT = Math.max(1, Math.min(6, chipCount));
  const chips = Array.from({ length: COUNT }, (_, i) => i);

  return (
    <section
      className={[
        'relative isolate overflow-hidden',
        theme === 'dark' ? 'bg-neutral-950' : 'bg-white',
      ].join(' ')}
      // Expose timing tokens on the host so children can always read them
      style={
        {
          ['--belt-speed' as any]: beltSpeed, // travel time across belt
          ['--cycle-speed' as any]: beltSpeed, // morph cycle matches belt travel (4 phases)
          ['--line-speed' as any]: '1.4s',
          ['--wheel-speed' as any]: '2.2s',
          ['--chip-gap' as any]: '56px',
          ['--chip-stagger' as any]: 'calc(var(--belt-speed) / var(--chip-count, 3))',
          ['--chip-count' as any]: String(COUNT),
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
        <div className="relative mx-auto h-44 sm:h-48 md:h-52">
          {/* belt with slight perspective */}
          <div
            className="absolute inset-x-0"
            style={{
              top: '54%',
              transform: 'translateY(-50%) perspective(800px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* top surface */}
            <div
              className="belt-top relative h-10 sm:h-11 md:h-12 rounded-md overflow-hidden shadow-lg"
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
            <div className="absolute inset-x-0 -bottom-8 flex items-end justify-between px-6 sm:px-10 md:px-14">
              {[0, 1, 2, 3].map((i) => (
                <Wheel key={i} dark={theme === 'dark'} reduce={reduce} />
              ))}
            </div>
          </div>

          {/* CHIPS (1–3 on screen) */}
          <ul
            className="absolute left-0 right-0 z-10 flex items-center"
            style={{
              bottom: 'calc(50% + 1.4rem)',
              gap: 'var(--chip-gap)',
            }}
            aria-hidden="true"
          >
            {chips.map((i) => (
              <li
                key={i}
                className={['chip', visualVariant(i)].join(' ')}
                style={
                  reduce
                    ? { animation: 'none' }
                    : ({ ['--i' as any]: String(i) } as React.CSSProperties)
                }
              >
                {/* Reserve width to fit the longest phrase so morphs don't clip */}
                <span className="ghost" aria-hidden="true">
                  {LONGEST}
                </span>

                {/* Stacked labels that fade/slide in sequence */}
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
          animation-duration: var(--line-speed, 1.4s);
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          /* bigger text; scales with viewport but stays readable */
          font-weight: 700;
          font-size: clamp(0.95rem, 1.8vw, 1.125rem);
          line-height: 1.1;
          letter-spacing: 0.1px;

          padding: 10px 16px;
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
          animation-duration: var(--belt-speed, 8s);
          /* stagger each chip's start so they space out */
          animation-delay: calc(var(--i) * (var(--belt-speed) / var(--chip-count, 3)) * -1);

          /* stash phase for word morph */
          --chip-phase: calc((var(--belt-speed, 8s) / 4) * var(--i));

          /* ensure positioned child labels can overlay fully */
          overflow: hidden;
        }
        :global(section.bg-neutral-950) .chip {
          color: #e5e7eb;
          background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: var(--ef-elev-1-dark);
        }

        /* width reservation so longest phrase fits */
        .ghost {
          visibility: hidden;
          pointer-events: none;
          user-select: none;
        }

        /* stacked labels that animate */
        .w {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          opacity: 0;
          transform: translateY(10px);
          animation-name: wordWindow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--cycle-speed, 8s);
        }
        /* Each label gets a 25% window; negative delays align sequence per chip */
        .w1 {
          animation-delay: calc(0s - var(--chip-phase));
        }
        .w2 {
          animation-delay: calc((var(--cycle-speed, 8s) * -0.25) - var(--chip-phase));
        }
        .w3 {
          animation-delay: calc((var(--cycle-speed, 8s) * -0.5) - var(--chip-phase));
        }
        .w4 {
          animation-delay: calc((var(--cycle-speed, 8s) * -0.75) - var(--chip-phase));
        }

        /* visual variants (keep subtle) */
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
        .chip--gold-solid {
          background: linear-gradient(180deg, #f0b34e 0%, var(--ef-gold) 100%);
          color: #1a1304;
          border-color: transparent;
          box-shadow: 0 0 0 1px rgba(221, 158, 55, 0.25) inset,
            0 6px 16px rgba(221, 158, 55, 0.18);
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
        /* label shows ~22% of cycle with small crossfade */
        @keyframes wordWindow {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          6% {
            opacity: 1;
            transform: translateY(0);
          }
          28% {
            opacity: 1;
            transform: translateY(0);
          }
          34% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
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
        'relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full',
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
                animationDuration: 'var(--wheel-speed, 2.2s)',
              }),
        }}
      />
    </div>
  );
}

/* Rotate chip look a bit (kept subtle) */
function visualVariant(i: number) {
  const mod = i % 3;
  if (mod === 0) return 'chip--emerald-soft';
  if (mod === 1) return 'chip--teal-soft';
  return 'chip--gold-solid';
}






