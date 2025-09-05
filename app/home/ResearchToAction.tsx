// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decisions'] as const;
const STATIONS = [0.25, 0.5, 0.75]; // where the “cover” sits along the belt (25%, 50%, 75%)

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true,  // set false to force animation even if OS has Reduce Motion
  chipCount = 1,         // 1–3 recommended
  beltSpeed = '7s',      // lower = faster (e.g., '6s')
}: {
  theme?: Theme;
  respectMotion?: boolean;
  chipCount?: number;
  beltSpeed?: string;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  const COUNT = Math.max(1, Math.min(3, chipCount));
  // indexes for current word per chip
  const [labels, setLabels] = React.useState<number[]>(
    () => Array.from({ length: COUNT }, () => 0)
  );

  // RAF loop to swap words when a chip crosses a station (while it’s hidden by the cover)
  React.useEffect(() => {
    if (reduce) return;

    const durMs = parseDurationMs(beltSpeed);
    const lastProg = new Array(COUNT).fill(0);

    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = now - t0;

      setLabels((prev) => {
        let mutated = false;
        const next = [...prev];

        for (let i = 0; i < COUNT; i++) {
          // evenly space chips by phase (time) offset
          const offset = (i * durMs) / COUNT;
          const prog = ((elapsed + offset) % durMs) / durMs; // 0..1

          for (const s of STATIONS) {
            if (crossed(lastProg[i], prog, s)) {
              next[i] = (next[i] + 1) % WORDS.length;
              mutated = true;
            }
          }
          lastProg[i] = prog;
        }
        return mutated ? next : prev;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, beltSpeed, COUNT]);

  return (
    <section
      className={[
        'relative isolate overflow-hidden',
        theme === 'dark' ? 'bg-neutral-950' : 'bg-white',
      ].join(' ')}
      style={
        {
          // speeds & layout tokens exposed on host for reliability
          ['--belt-speed' as any]: beltSpeed,
          ['--line-speed' as any]: '1.2s',
          ['--wheel-speed' as any]: '2s',
          ['--chip-gap' as any]: '72px',
          ['--chip-count' as any]: String(COUNT),
          ['--station-w' as any]: 'min(22rem, 32vw)', // cover width (wide enough to hide the longest word)
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
          {/* belt group with slight perspective */}
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

            {/* side face for depth */}
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

          {/* CHANGE STATIONS (covers): placed above chips to hide swaps */}
          <div
            className="stations pointer-events-none absolute inset-x-0 z-20"
            style={{ bottom: 'calc(50% + 1.55rem)', height: 0 }}
            aria-hidden="true"
          >
            {STATIONS.map((f) => (
              <div
                key={f}
                className="station"
                style={{ left: `${f * 100}%` }}
              >
                <span className="station-lid" />
                <span className="station-shade" />
              </div>
            ))}
          </div>

          {/* CHIPS (1–3 on screen) */}
          <ul
            className="absolute left-0 right-0 z-10 flex items-center"
            style={{
              bottom: 'calc(50% + 1.55rem)',
              gap: 'var(--chip-gap)',
            }}
            aria-hidden="true"
          >
            {Array.from({ length: COUNT }, (_, i) => (
              <li
                key={i}
                className={['chip', chipLook(i)].join(' ')}
                style={
                  reduce
                    ? { animation: 'none' }
                    : ({
                        ['--i' as any]: String(i),
                        // staggered start so chips are spaced
                        animationDelay: `calc(var(--i) * (var(--belt-speed) / var(--chip-count)) * -1)`,
                      } as React.CSSProperties)
                }
              >
                {/* Single dynamic label per chip (no morphing text jump visible, swap happens under cover) */}
                <span className="label">{WORDS[labels[i] as number]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* STYLES */}
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
          animation: lineScroll var(--line-speed, 1.2s) linear infinite;
          opacity: 0.45;
        }
        .belt-grain {
          background: radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px) 0 0 /
            6px 6px;
        }

        /* stations (covers) */
        .station {
          position: absolute;
          top: 0;
          transform: translate(-50%, -6px); /* sit slightly over chip */
          width: var(--station-w);
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(180deg, #dfeef5, #c7e1f2);
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }
        .station-lid {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 12px;
          background: linear-gradient(180deg, #9fbfd2, #7ca9c6);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        }
        .station-shade {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              120% 75% at 50% 0%,
              rgba(0, 0, 0, 0.35),
              transparent 60%
            ),
            linear-gradient(180deg, rgba(0, 0, 0, 0.2), transparent 40%);
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        :global(section.bg-white) .station {
          background: linear-gradient(180deg, #f0f6fa, #e4f1fa);
        }
        :global(section.bg-white) .station-lid {
          background: linear-gradient(180deg, #b7d3e3, #95bfd7);
        }

        /* chips */
        .chip {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;

          font-weight: 800;
          font-size: clamp(1rem, 2vw, 1.15rem);
          line-height: 1.1;
          letter-spacing: 0.15px;

          padding: 10px 18px;
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
          animation: beltTravel var(--belt-speed, 7s) linear infinite;
          /* NOTE: animation-delay set inline based on chip index/spacing */
        }
        :global(section.bg-neutral-950) .chip {
          color: #e5e7eb;
          background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: var(--ef-elev-1-dark);
        }

        /* subtle looks so the UI stays on-brand but not loud */
        .chip--emerald {
          background: linear-gradient(
            180deg,
            rgba(12, 138, 106, 0.12) 0%,
            rgba(12, 138, 106, 0.04) 100%
          );
          border-color: rgba(12, 138, 106, 0.35);
        }
        .chip--teal {
          background: linear-gradient(
            180deg,
            rgba(44, 127, 184, 0.12) 0%,
            rgba(44, 127, 184, 0.04) 100%
          );
          border-color: rgba(44, 127, 184, 0.35);
        }
        .chip--gold {
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
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .chip,
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
                animationDuration: 'var(--wheel-speed, 2s)',
              }),
        }}
      />
    </div>
  );
}

function chipLook(i: number) {
  if (i % 3 === 0) return 'chip--emerald';
  if (i % 3 === 1) return 'chip--teal';
  return 'chip--gold';
}

function parseDurationMs(v: string) {
  const s = v.trim().toLowerCase();
  if (s.endsWith('ms')) return Math.max(0, parseFloat(s.slice(0, -2)));
  if (s.endsWith('s')) return Math.max(0, parseFloat(s.slice(0, -1)) * 1000);
  const n = Number(s);
  return Number.isFinite(n) ? n : 7000;
}

/** Did we cross target in [prev, curr] on a circular 0..1 timeline? */
function crossed(prev: number, curr: number, target: number) {
  if (prev === curr) return false;
  if (prev < curr) return prev < target && target <= curr;
  // wrapped around 1→0
  return prev < target || target <= curr;
}







