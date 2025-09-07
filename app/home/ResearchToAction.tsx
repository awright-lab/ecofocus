// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decisions'] as const;
// path stops where nodes/labels appear (start + 3 mids + end)
const STOPS = [0.0, 0.33, 0.66, 0.88, 1.0] as const;

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true,
  lineWidth = 6,
  completeAt = 0.6,   // line is fully drawn when section top reaches 60% of viewport
  startAt = 0.95,     // start drawing when section top reaches 95% of viewport
  shimmer = true,
}: {
  theme?: Theme;
  respectMotion?: boolean;
  lineWidth?: number;
  completeAt?: number; // 0..1 viewport fraction
  startAt?: number;    // 0..1 viewport fraction
  shimmer?: boolean;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  const sectionRef = React.useRef<HTMLElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);

  const [len, setLen] = React.useState(1);
  const [pts, setPts] = React.useState<{ x: number; y: number }[]>([]);
  const [progress, setProgress] = React.useState(0); // 0..1 scroll-driven

  // measure path + compute stop positions
  React.useLayoutEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const L = p.getTotalLength();
    setLen(L);
    const positions = STOPS.map((t) => {
      const pt = p.getPointAtLength(L * t);
      return { x: pt.x, y: pt.y };
    });
    setPts(positions);
  }, []);

  // scroll → progress mapping (complete earlier)
  React.useEffect(() => {
    if (reduce) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 0;

        // When the section top crosses startAt*vh, start revealing.
        // When it crosses completeAt*vh, it's fully revealed.
        const startY = vh * clamp(startAt, 0, 1);
        const endY = vh * clamp(completeAt, 0, 1);
        const denom = Math.max(1, Math.abs(startY - endY));
        const raw = (startY - r.top) / denom;
        const p = clamp(raw, 0, 1);

        // snap quickly (slight ease)
        const eased = easeOutCubic(p);
        setProgress(eased);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, startAt, completeAt]);

  const dashOffset = (1 - progress) * len;
  const revealStyle: React.CSSProperties = {
    strokeDasharray: `${len}`,
    strokeDashoffset: `${dashOffset}`,
  };

  // label colors (marigold last)
  const labelColors = [
    'var(--ef-emerald)',   // Market Research
    'var(--ef-teal)',      // Data
    'var(--ef-emerald)',   // Knowledge (lighter than gold to keep hierarchy)
    'var(--ef-marigold)',  // Informed Decision (marigold last)
  ];

  return (
    <section
      ref={sectionRef as any}
      className={[
        'ef-flow relative isolate overflow-hidden',
        theme === 'dark' ? 'ef-dark' : 'ef-light',
        reduce ? 'is-reduced' : '',
      ].join(' ')}
      style={
        {
          ['--ef-lw' as any]: lineWidth,
          ['--ef-len' as any]: `${len}px`,
        } as React.CSSProperties
      }
      aria-label="From Market Research to Informed Decision"
    >
      <div className="ef-wrap">
        <p className="ef-kicker">From Research to Action</p>

        <svg
          ref={svgRef}
          viewBox="0 0 1100 280"
          width="100%"
          className="ef-svg"
          role="img"
          aria-labelledby="efTitle efDesc"
        >
          <title id="efTitle">EcoFocus growth flow</title>
          <desc id="efDesc">
            As you scroll, a flowline draws left to right, then the four labels appear near their nodes.
          </desc>

          <defs>
            {/* moving gradient similar to bg-gradient-to-r ... animate-gradient */}
            <linearGradient id="efSlideGrad" x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#3B82F6" stopOpacity="0.85" />  {/* blue-500 */}
              <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.95" />  {/* teal-400 */}
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" /> {/* emerald-500 */}
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="0 0"
                to="560 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* Mask that reveals only drawn portion for the shimmer overlay */}
            <mask id="efReveal">
              <path
                d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
                fill="none"
                stroke="#fff"
                strokeWidth={lineWidth + 2}
                strokeLinecap="round"
                style={revealStyle}
              />
            </mask>
          </defs>

          {/* Base path (brand emerald) */}
          <path
            ref={pathRef}
            className="ef-path-base"
            d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
            style={revealStyle}
          />

          {/* Shimmer overlay clipped to revealed portion */}
          {shimmer && (
            <path
              className="ef-path-shimmer"
              d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
              mask="url(#efReveal)"
            />
          )}

          {/* Nodes */}
          {pts.map(({ x, y }, i) => {
            const visible = progress >= STOPS[i] - 0.001;
            return (
              <circle
                key={`dot-${i}`}
                className="ef-dot"
                cx={x}
                cy={y}
                r="7"
                style={{ opacity: visible ? 1 : 0 }}
                aria-hidden="true"
              />
            );
          })}

          {/* Labels (lighter, offset away from the line) */}
          {pts.slice(1).map(({ x, y }, i) => {
            const revealed = progress >= STOPS[i + 1] - 0.001 || reduce;
            const above = i % 2 === 0;
            const dy = above ? -36 : 40; // push farther from line for readability
            return (
              <text
                key={`label-${i}`}
                x={x + 18}
                y={y + dy}
                textAnchor="start"
                style={{
                  font: '700 clamp(14px, 2.2vw, 18px)/1.1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif',
                  fill: labelColors[i],
                  paintOrder: 'stroke',
                  // very light outline to separate from background
                  stroke: 'rgba(255,255,255,0.85)',
                  strokeWidth: theme === 'dark' ? 0.6 : 0.4,
                  opacity: revealed ? 1 : 0,
                  transform: `translateY(${revealed ? 0 : 6}px)`,
                  transition: 'opacity 420ms ease, transform 420ms ease',
                  userSelect: 'none',
                }}
              >
                {WORDS[i]}
              </text>
            );
          })}
        </svg>
      </div>

      <style jsx>{`
        .ef-flow {
          --ef-emerald: #00767a;
          --ef-teal: #2c7fb8;
          --ef-gold: #f0c24b;
          --ef-marigold: #ffc107;

          --ef-bg-dark: #0b1220;
          --ef-bg-light: #ffffff;
          --ef-sub-dark: rgba(255, 255, 255, 0.65);
          --ef-sub-light: rgba(11, 34, 36, 0.6);

          padding: clamp(24px, 5vw, 64px);
          border-radius: 20px;
        }
        .ef-dark {
          background: radial-gradient(60% 60% at 50% 20%, rgba(44, 127, 184, 0.12), transparent 60%), var(--ef-bg-dark);
        }
        .ef-light {
          background: radial-gradient(60% 60% at 50% 20%, rgba(16, 185, 129, 0.08), transparent 60%), var(--ef-bg-light);
        }
        .ef-wrap {
          max-width: 1100px;
          margin: 0 auto;
        }
        .ef-kicker {
          text-align: center;
          color: var(--ef-sub-dark);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 700;
          font-size: 0.8rem;
          margin: 0 0 1.5rem;
        }
        :global(.ef-light) .ef-kicker {
          color: var(--ef-sub-light);
        }

        .ef-svg {
          display: block;
          height: clamp(220px, 28vw, 320px);
          overflow: visible;
        }

        .ef-path-base {
          stroke: var(--ef-emerald);
          stroke-width: var(--ef-lw, 6);
          fill: none;
          stroke-linecap: round;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
          transition: stroke 200ms ease;
          stroke-dasharray: var(--ef-len);
          stroke-dashoffset: var(--ef-len);
        }

        .ef-path-shimmer {
          stroke: url(#efSlideGrad);
          stroke-width: calc(var(--ef-lw, 6) + 2);
          fill: none;
          stroke-linecap: round;
          opacity: 0.85;
          mix-blend-mode: screen;
        }

        .ef-dot {
          fill: #ffffff;
          stroke: var(--ef-emerald);
          stroke-width: 4;
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.25));
          transition: opacity 250ms ease;
        }

        /* Reduced motion: show final state; keep shimmer still */
        .is-reduced .ef-path-base {
          stroke-dashoffset: 0 !important;
        }
        .is-reduced .ef-path-shimmer {
          opacity: 0.6;
        }
      `}</style>
    </section>
  );
}

/* ---------- helpers ---------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}











