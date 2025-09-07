// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

// 4 phases, and where along the path to reveal nodes (0..1 incl. start/end)
const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decision'] as const;
const STOPS = [0.0, 0.33, 0.66, 0.88, 1.0] as const; // 5 nodes (start + 3 mid + end)

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true,
  lineWidth = 6,
  shimmer = true,
}: {
  theme?: Theme;
  respectMotion?: boolean;
  lineWidth?: number;
  shimmer?: boolean;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  const sectionRef = React.useRef<HTMLElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const maskRef = React.useRef<SVGPathElement>(null);

  const [len, setLen] = React.useState(1); // path length (px)
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

  // scroll-driven progress (starts at ~70% viewport, finishes ~25% past)
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
        const start = vh * 0.7;                 // when top nears ~70% viewport height
        const endSpan = r.height + vh * 0.25;   // finish a bit after leaving
        const p = clamp((start - r.top) / Math.max(1, endSpan), 0, 1);
        setProgress(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // dynamic styles for reveal (stroke-dashoffset math)
  const dashOffset = (1 - progress) * len;
  const revealStyle: React.CSSProperties = {
    strokeDasharray: `${len}`,
    strokeDashoffset: `${dashOffset}`,
  };

  // label colors, last is marigold as requested
  const labelColors = [
    'var(--ef-emerald)',  // Market Research
    'var(--ef-teal)',     // Data
    'var(--ef-gold)',     // Knowledge (golden tone)
    'var(--ef-marigold)', // Informed Decision (marigold last)
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
            As you scroll, a flowline grows left to right, revealing: Market Research, Data, Knowledge, Informed Decision.
          </desc>

          {/* Animated stroke gradient for shimmer */}
          <defs>
            <linearGradient id="efGrad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#90e0d3" stopOpacity="0.0" />
              <stop offset="35%" stopColor="#2C7FB8" stopOpacity="0.35" />
              <stop offset="65%" stopColor="#00b39a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#90e0d3" stopOpacity="0.0" />
            </linearGradient>

            {/* Mask that reveals only the drawn portion of the path */}
            <mask id="efReveal">
              <path
                ref={maskRef}
                d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
                fill="none"
                stroke="#fff"
                strokeWidth={lineWidth + 2}
                strokeLinecap="round"
                style={revealStyle}
              />
            </mask>
          </defs>

          {/* Base path (revealed by scroll) */}
          <path
            ref={pathRef}
            className="ef-path-base"
            d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
            style={revealStyle}
          />

          {/* Shimmer overlay (clipped to revealed portion) */}
          {shimmer && (
            <path
              className="ef-path-shimmer"
              d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
              mask="url(#efReveal)"
            />
          )}

          {/* Dots at each stop */}
          {pts.map(({ x, y }, i) => {
            const visible = progress >= STOPS[i] - 0.001;
            return (
              <circle
                key={`dot-${i}`}
                className="ef-dot"
                cx={x}
                cy={y}
                r="8"
                style={{ opacity: visible ? 1 : 0 }}
                aria-hidden="true"
              />
            );
          })}

          {/* Labels near nodes (avoid crossing the line + add pill background) */}
          {pts.slice(1).map(({ x, y }, i) => {
            const revealed = progress >= STOPS[i + 1] - 0.001;
            const above = i % 2 === 0; // alternate above/below
            const dy = above ? -28 : 30; // keep text off the line
            return (
              <SvgLabel
                key={`label-${i}`}
                x={x + 16}
                y={y + dy}
                color={labelColors[i]}
                text={WORDS[i]}
                show={revealed || reduce}
                align="start"
                pill
              />
            );
          })}
        </svg>
      </div>

      <style jsx>{`
        /* brand tokens */
        .ef-flow {
          --ef-emerald: #00767a;
          --ef-teal: #2c7fb8;
          --ef-gold: #f5b300;     /* warm gold for Knowledge */
          --ef-marigold: #ffc107; /* marigold for the last word */
          --ef-ink: #0b2224;
          --ef-ink-inv: #ffffff;
          --ef-bg: #0b1220;
          --ef-bg-light: #ffffff;
          --ef-sub: rgba(255, 255, 255, 0.65);
        }
        .ef-dark {
          background: radial-gradient(60% 60% at 50% 20%, rgba(44, 127, 184, 0.12), transparent 60%), var(--ef-bg);
          padding: clamp(24px, 5vw, 64px);
          border-radius: 20px;
        }
        .ef-light {
          --ef-sub: rgba(11, 34, 36, 0.6);
          background: radial-gradient(60% 60% at 50% 20%, rgba(16, 185, 129, 0.08), transparent 60%), var(--ef-bg-light);
          padding: clamp(24px, 5vw, 64px);
          border-radius: 20px;
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

        /* Base line (revealed by scroll) */
        .ef-path-base {
          stroke: var(--ef-emerald);
          stroke-width: var(--ef-lw, 6);
          fill: none;
          stroke-linecap: round;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
          transition: stroke 200ms ease;
        }

        /* Shimmer overlay: gradient + moving dash to create "energy" along the path */
        .ef-path-shimmer {
          stroke: url(#efGrad);
          stroke-width: calc(var(--ef-lw, 6) + 2);
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: 28 140; /* moving segments */
          animation: ef-dash 1400ms linear infinite;
          mix-blend-mode: screen;
          opacity: 0.9;
        }
        @keyframes ef-dash {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: 168; }
        }

        /* Dots */
        .ef-dot {
          fill: #ffffff;
          stroke: var(--ef-emerald);
          stroke-width: 4;
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.25));
          transition: opacity 300ms ease;
        }

        /* Reduced motion: show final state; disable shimmer dash */
        .is-reduced .ef-path-shimmer,
        .is-reduced .ef-path-base {
          animation: none !important;
        }
        .is-reduced .ef-path-shimmer {
          stroke-dasharray: none;
        }
      `}</style>
    </section>
  );
}

/* ---------- helpers ---------- */

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** SVG text with an auto-sized rounded rect "pill" for readability */
function SvgLabel({
  x,
  y,
  text,
  color,
  show,
  align = 'start',
  pill = true,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  show: boolean;
  align?: 'start' | 'middle' | 'end';
  pill?: boolean;
}) {
  const textRef = React.useRef<SVGTextElement>(null);
  const [box, setBox] = React.useState<{ w: number; h: number } | null>(null);

  React.useLayoutEffect(() => {
    const t = textRef.current;
    if (!t) return;
    const b = t.getBBox();
    setBox({ w: b.width, h: b.height });
  }, [text]);

  const padX = 10;
  const padY = 6;
  const rx = 10;

  // compute anchor offset
  let tx = x;
  if (align === 'middle' && box) tx = x - box.w / 2;
  if (align === 'end' && box) tx = x - box.w;

  return (
    <g
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 420ms ease, transform 420ms ease',
        transform: `translateY(${show ? 0 : 6}px)`,
      }}
    >
      {pill && box && (
        <rect
          x={tx - padX}
          y={y - (box.h + padY) + (box ? box.h - 14 : 0)}
          width={box.w + padX * 2}
          height={box.h + padY}
          rx={rx}
          fill="rgba(255,255,255,0.92)"
          stroke="rgba(0,0,0,0.08)"
        />
      )}
      <text
        ref={textRef}
        x={x}
        y={y}
        textAnchor={align}
        style={{
          font: '800 18px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
          fill: color,
          paintOrder: 'stroke',
          stroke: 'rgba(0,0,0,0.25)',
          strokeWidth: 1,
          userSelect: 'none',
        }}
      >
        {text}
      </text>
    </g>
  );
}










