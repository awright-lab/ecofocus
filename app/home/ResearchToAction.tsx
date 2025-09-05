// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decisions'] as const;
const LONGEST = 'Informed Decisions';
const STATIONS = [0.25, 0.5, 0.75]; // where the chip passes under covers

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true,   // set false to force animation even if OS prefers reduced motion
  chipCount = 1,          // 1 by default; try 2–3 if you want more
  beltSpeed = '6s',       // lower = faster
}: {
  theme?: Theme;
  respectMotion?: boolean;
  chipCount?: number;
  beltSpeed?: string;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  const COUNT = Math.max(1, Math.min(3, chipCount));
  const [labels, setLabels] = React.useState<number[]>(
    () => Array.from({ length: COUNT }, () => 0)
  );

  const beltTopRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [chipW, setChipW] = React.useState<number | null>(null);
  const [chipH, setChipH] = React.useState<number | null>(null);
  const [travelPx, setTravelPx] = React.useState(0);

  // Measure belt width + chip size → exact travel distance (left edge → right edge)
  React.useLayoutEffect(() => {
    const update = () => {
      const beltW = beltTopRef.current?.clientWidth ?? 0;
      const m = measureRef.current;
      const w = m?.clientWidth ?? 0;
      const h = m?.clientHeight ?? 0;
      setChipW(w || null);
      setChipH(h || null);
      setTravelPx(Math.max(0, beltW - (w || 0)));
    };
    update();

    const ro = new ResizeObserver(update);
    if (beltTopRef.current) ro.observe(beltTopRef.current);
    if (measureRef.current) ro.observe(measureRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // Swap the label while the chip is hidden under a cover
  React.useEffect(() => {
    if (reduce) return;
    const durMs = parseDurationMs(beltSpeed);
    const lastProg = new Array(COUNT).fill(0);
    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = now - t0;
      setLabels(prev => {
        let changed = false;
        const next = [...prev];
        for (let i = 0; i < COUNT; i++) {
          const offset = (i * durMs) / COUNT;                 // phase chips evenly
          const prog = ((elapsed + offset) % durMs) / durMs;  // 0..1
          for (const s of STATIONS) {
            if (crossed(lastProg[i], prog, s)) {
              next[i] = (next[i] + 1) % WORDS.length;
              changed = true;
            }
          }
          lastProg[i] = prog;
        }
        return changed ? next : prev;
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
      // expose tokens (reliable for styled-jsx)
      style={
        {
          ['--belt-speed' as any]: beltSpeed,
          ['--line-speed' as any]: beltSpeed, // sync belt dash motion with chip
          ['--wheel-speed' as any]: '1.6s',
          ['--chip-w' as any]: chipW ? `${chipW}px` : '18rem', // fallback width to avoid tiny first paint
          ['--chip-h' as any]: chipH ? `${chipH}px` : '46px',
          ['--travel' as any]: `${travelPx}px`,
          ['--chip-count' as any]: String(COUNT),
          ['--station-w' as any]: 'calc(var(--chip-w) + 28px)', // cover wider than chip
          ['--station-h' as any]: 'calc(var(--chip-h) + 8px)',  // cover taller than chip
        } as React.CSSProperties
      }
    >
      {/* ambient */}
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

        {/* Scene */}
        <div className="relative mx-auto h-44 sm:h-48 md:h-52">
          <div
            className="absolute inset-x-0"
            style={{
              top: '54%',
              transform: 'translateY(-50%) perspective(900px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* belt */}
            <div
              ref={beltTopRef}
              className="belt-top relative h-10 sm:h-11 md:h-12 rounded-md overflow-hidden shadow-lg"
              style={{ transform: 'translateZ(0)' }}
            >
              <span
                className="belt-line absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px]"
                style={reduce ? { animation: 'none' } : undefined}
              />
              <span className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply belt-grain" />
            </div>
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
            <div className="absolute inset-x-0 -bottom-8 flex items-end justify-between px-6 sm:px-10 md:px-14">
              {[0, 1, 2, 3].map(i => (
                <Wheel key={i} dark={theme === 'dark'} reduce={reduce} />
              ))}
            </div>

            {/* covers */}
            <div
              className="stations pointer-events-none absolute inset-x-0 z-20"
              style={{ bottom: 'calc(100% + 0.6rem)', height: 0 }}
              aria-hidden="true"
            >
              {STATIONS.map(f => (
                <div key={f} className="station" style={{ left: `${f * 100}%` }}>
                  <span className="station-top" />
                  <span className="station-shade" />
                </div>
              ))}
            </div>

            {/* chips */}
            <div
              className="chips absolute left-0 right-0 z-10"
              style={{ bottom: 'calc(100% + 0.6rem)', height: 0 }}
            >
              {/* measurer (hidden) */}
              <div ref={measureRef} className="chip chip--measure">
                <span className="label">{LONGEST}</span>
              </div>

              {Array.from({ length: COUNT }, (_, i) => (
                <div
                  key={i}
                  className={['chip', chipLook(i)].join(' ')}
                  style={
                    reduce
                      ? { animation: 'none' }
                      : ({
                          ['--i' as any]: String(i),
                          animationDelay: `calc(var(--i) * (var(--belt-speed) / var(--chip-count)) * -1)`,
                        } as React.CSSProperties)
                  }
                >
                  <span className="label">{WORDS[labels[i] as number]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* styles */}
      <style jsx>{`
        /* tokens */
        :root {
          --ef-ink: #0f172a;
          --ef-paper: #ffffff;
          --ef-paper-2: #f6f8fb;
          --ef-elev-1-dark: 0 6px 18px rgba(0, 0, 0, 0.35), inset 0 1px rgba(255, 255, 255, 0.05);
        }

        /* belt */
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
          animation: lineScroll var(--line-speed, 6s) linear infinite; /* synced to beltSpeed */
          opacity: 0.45;
        }
        .belt-grain {
          background: radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px) 0 0 / 6px 6px;
        }
        :global(section.bg-white) .belt-top {
          background: linear-gradient(180deg, #f3faf6 0%, #ecf7f2 100%);
        }
        :global(section.bg-white) .belt-side {
          background: linear-gradient(180deg, #eaf4fb 0%, #dff0fa 100%);
        }

        /* covers sized to chip */
        .station {
          position: absolute;
          width: var(--station-w);
          height: var(--station-h);
          transform: translate(-50%, -2px);
          border-radius: 12px;
          background: linear-gradient(180deg, #dfeef5, #c7e1f2);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.22);
          overflow: hidden;
        }
        .station-top {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 10px;
          background: linear-gradient(180deg, #9fbfd2, #7ca9c6);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
        }
        .station-shade {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(140% 80% at 50% 0%, rgba(0, 0, 0, 0.33), transparent 60%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.16), transparent 40%);
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        /* chips */
        .chips { pointer-events: none; }

        .chip {
          position: absolute;
          left: 0;                             /* left edge of belt */
          width: var(--chip-w);                /* fixed to the longest word */
          height: var(--chip-h);               /* ensures proper cover sizing */
          transform: translateX(0);
          display: inline-flex;
          align-items: center;
          justify-content: center;

          /* BIG, readable label */
          font-weight: 900;
          font-size: clamp(1.1rem, 2.4vw, 1.4rem);
          line-height: 1.1;
          letter-spacing: 0.2px;

          padding: 12px 22px;
          border-radius: 999px;
          white-space: nowrap;

          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0,0,0,.35);
          background: linear-gradient(180deg, #0d2233, #0f2a40);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35), inset 0 1px rgba(255, 255, 255, 0.08);

          will-change: transform;
          animation: traverse var(--belt-speed, 6s) linear infinite; /* edge → edge */
        }

        .chip--measure {
          position: absolute;
          visibility: hidden;
          pointer-events: none;
          left: -9999px;
        }

        .chip--emerald { background: linear-gradient(180deg, #0e2a24, #11342c); }
        .chip--teal    { background: linear-gradient(180deg, #0d2636, #103049); }
        .chip--gold    { background: linear-gradient(180deg, #2a210b, #35270d); color: #fff8e0; }

        .label { position: relative; z-index: 1; }

        /* animations */
        @keyframes traverse {
          from { transform: translateX(0); }
          to   { transform: translateX(var(--travel)); } /* right edge of belt */
        }
        @keyframes lineScroll {
          from { background-position: 0 0; }
          to   { background-position: 48px 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .chip, .belt-line { animation: none !important; }
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
                animationDuration: 'var(--wheel-speed, 1.6s)',
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
  return Number.isFinite(n) ? n : 6000;
}

/** Did we cross target in [prev, curr] on a circular 0..1 timeline? */
function crossed(prev: number, curr: number, target: number) {
  if (prev === curr) return false;
  if (prev < curr) return prev < target && target <= curr;
  return prev < target || target <= curr; // wrapped around
}








