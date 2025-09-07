// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decision'] as const;
// where along the path we reveal nodes/labels (0..1, includes start + end)
const STOPS = [0.0, 0.33, 0.66, 0.88, 1.0] as const;

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true,
  drawMs = 1800,           // total path-draw duration
  lineWidth = 6,
}: {
  theme?: Theme;
  respectMotion?: boolean;
  drawMs?: number;
  lineWidth?: number;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  const svgRef = React.useRef<SVGSVGElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);

  const [len, setLen] = React.useState(0);
  const [pts, setPts] = React.useState<{ x: number; y: number }[]>([]);
  const [inView, setInView] = React.useState(false);

  // Measure path and compute node positions
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

  // Trigger animation when in view
  React.useEffect(() => {
    if (reduce) {
      setInView(true);
      return;
    }
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Label colors (EcoFocus palette)
  const labelColors = ['var(--ef-emerald)', 'var(--ef-teal)', 'var(--ef-gold)', 'var(--ef-emerald)'];

  return (
    <section
      className={[
        'ef-flow relative isolate overflow-hidden',
        theme === 'dark' ? 'ef-dark' : 'ef-light',
        inView ? 'is-in' : '',
        reduce ? 'is-reduced' : '',
      ].join(' ')}
      style={
        {
          ['--ef-draw' as any]: `${drawMs}ms`,
          ['--ef-lw' as any]: lineWidth,
          ['--ef-len' as any]: `${len || 1}px`, // avoid 0 for initial paint
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
            A single line grows from left to right revealing Market Research, Data, Knowledge, Informed Decision.
          </desc>

          {/* Flow path (curvy vine) */}
          <path
            ref={pathRef}
            className="ef-path"
            d="
              M40,220
              C220,220 210,90 350,90
              S480,220 600,220
              S780,90 920,90
              S980,220 1060,220
            "
          />

          {/* Dots (visible at each stop) */}
          {pts.map(({ x, y }, i) => (
            <circle
              key={`dot-${i}`}
              className="ef-dot"
              cx={x}
              cy={y}
              r="8"
              style={!reduce ? { animationDelay: `${Math.round(drawMs * STOPS[i])}ms` } : undefined}
              aria-hidden="true"
            />
          ))}

          {/* Labels for the 4 phases (skip the first stop at index 0) */}
          {pts.slice(1).map(({ x, y }, i) => {
            const dy = i % 2 === 0 ? 28 : -18; // alternate above/below
            return (
              <g key={`label-${i}`} transform={`translate(${x + 16}, ${y + dy})`}>
                <text
                  className="ef-label"
                  style={
                    !reduce
                      ? {
                          color: labelColors[i],
                          animationDelay: `${Math.round(drawMs * STOPS[i + 1])}ms`,
                        }
                      : { color: labelColors[i] }
                  }
                >
                  {WORDS[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <style jsx>{`
        .ef-flow {
          --ef-bg: #0b1220;
          --ef-ink: #e6eef4;
          --ef-sub: rgba(230, 238, 244, 0.6);
          --ef-line: #00767a; /* emerald */
          --ef-emerald: #00767a;
          --ef-teal: #2c7fb8;
          --ef-gold: #ffc107;

          background: var(--ef-bg);
          padding: clamp(24px, 5vw, 64px);
          border-radius: 20px;
        }
        .ef-light {
          --ef-bg: #ffffff;
          --ef-ink: #0b2224;
          --ef-sub: rgba(11, 34, 36, 0.6);
          background: radial-gradient(60% 60% at 50% 20%, rgba(16, 185, 129, 0.08), transparent 60%), var(--ef-bg);
        }
        .ef-dark {
          background: radial-gradient(60% 60% at 50% 20%, rgba(44, 127, 184, 0.12), transparent 60%), var(--ef-bg);
        }

        .ef-wrap {
          max-width: 1100px;
          margin: 0 auto;
        }
        .ef-kicker {
          text-align: center;
          color: var(--ef-sub);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 700;
          font-size: 0.8rem;
          margin: 0 0 1.5rem;
        }

        .ef-svg {
          display: block;
          height: clamp(220px, 28vw, 320px);
          overflow: visible;
        }

        .ef-path {
          stroke: var(--ef-line);
          stroke-width: var(--ef-lw, 6);
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: var(--ef-len);
          stroke-dashoffset: var(--ef-len);
          animation: ef-draw var(--ef-draw, 1800ms) ease forwards;
          animation-play-state: paused;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
        }

        .ef-dot {
          fill: #ffffff;
          stroke: var(--ef-line);
          stroke-width: 4;
          opacity: 0;
          transform: scale(0.7);
          animation: ef-pop 420ms cubic-bezier(0.2, 0.7, 0, 1) forwards;
          animation-play-state: paused;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
        }

        .ef-label {
          font: 800 clamp(16px, 2.4vw, 22px) / 1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          fill: currentColor;
          paint-order: stroke;
          stroke: rgba(0, 0, 0, 0.25);
          stroke-width: 1px;
          opacity: 0;
          transform: translateY(8px);
          animation: ef-fadeup 480ms ease forwards;
          animation-play-state: paused;
          user-select: none;
        }

        /* Turn animations on when in view */
        .is-in .ef-path,
        .is-in .ef-dot,
        .is-in .ef-label {
          animation-play-state: running;
        }

        /* Reduced motion: show final state */
        .is-reduced .ef-path {
          stroke-dashoffset: 0 !important;
          animation: none !important;
        }
        .is-reduced .ef-dot,
        .is-reduced .ef-label {
          opacity: 1 !important;
          transform: none !important;
          animation: none !important;
        }

        @keyframes ef-draw {
          from {
            stroke-dashoffset: var(--ef-len);
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes ef-pop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          60% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes ef-fadeup {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}









