// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decision'] as const;
/** Exactly 4 node stops (0..1 along the path), one per word */
const STOPS = [0.12, 0.38, 0.64, 0.9] as const;

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true,
  lineWidth = 6,
  startAt = 0.9,      // start line reveal when section top reaches 90% of viewport
  completeAt = 0.45,  // fully revealed by the time section top reaches 45% of viewport
  shimmer = true,
  labelOffset = 44,   // px distance labels sit off the line (perpendicular)
  pulseMs = 750,      // node pulse duration
}: {
  theme?: Theme;
  respectMotion?: boolean;
  lineWidth?: number;
  startAt?: number;
  completeAt?: number;
  shimmer?: boolean;
  labelOffset?: number;
  pulseMs?: number;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  const sectionRef = React.useRef<HTMLElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const prevProgRef = React.useRef(0);

  const [len, setLen] = React.useState(1);
  const [progress, setProgress] = React.useState(0); // 0..1 scroll-mapped
  const [nodes, setNodes] = React.useState<{ x: number; y: number }[]>([]);
  const [labels, setLabels] = React.useState<{ x: number; y: number }[]>([]);
  const [pulseVersion, setPulseVersion] = React.useState<number[]>(
    () => Array(STOPS.length).fill(0)
  );

  /** Measure path length + compute node and label positions (also on resize) */
  React.useLayoutEffect(() => {
    const measure = () => {
      const p = pathRef.current;
      if (!p) return;
      const L = p.getTotalLength();
      setLen(L);

      // For each stop, get point + a tiny step ahead to compute a tangent & normal
      const eps = Math.max(0.0008, 1 / L);
      const pts = STOPS.map((t) => p.getPointAtLength(L * t));
      const labelPts = STOPS.map((t, i) => {
        const a = p.getPointAtLength(L * t);
        const b = p.getPointAtLength(L * Math.min(1, t + eps));
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const mag = Math.hypot(dx, dy) || 1;
        // normal vector (perpendicular to tangent)
        const nx = -dy / mag;
        const ny = dx / mag;
        // alternate sides (above/below) so labels never sit on the line
        const side = i % 2 === 0 ? -1 : 1;
        // small forward step along tangent for nicer spacing
        const tx = (dx / mag) * 10;
        const ty = (dy / mag) * 10;
        return { x: a.x + nx * labelOffset * side + tx, y: a.y + ny * labelOffset * side + ty };
      });

      setNodes(pts);
      setLabels(labelPts);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, [labelOffset]);

  /** Scroll → progress (rAF throttled) + detect stop crossings to trigger pulses */
  React.useEffect(() => {
    if (reduce) {
      setProgress(1);
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const el = sectionRef.current;
          const p = easeOutCubic(computeProgress(el, startAt, completeAt));
          // pulse when we cross a stop in either direction
          const prev = prevProgRef.current;
          if (p !== prev) {
            setPulseVersion((prevArr) => {
              let changed = false;
              const next = [...prevArr];
              for (let i = 0; i < STOPS.length; i++) {
                const s = STOPS[i];
                if ((prev < s && p >= s) || (prev > s && p <= s)) {
                  next[i] = next[i] + 1; // bump version to remount node & retrigger animation
                  changed = true;
                }
              }
              return changed ? next : prevArr;
            });
            prevProgRef.current = p;
          }
          setProgress(p);
          ticking = false;
        });
      }
    };
    const onResize = onScroll;

    // initial tick
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [reduce, startAt, completeAt]);

  /** Stroke-dash reveal for the path */
  const dashOffset = (1 - progress) * len;
  const revealStyle: React.CSSProperties = {
    strokeDasharray: `${len}`,
    strokeDashoffset: `${dashOffset}`,
  };

  /** Label colors in order, marigold last */
  const labelColors = [
    'var(--ef-emerald)',  // Market Research
    'var(--ef-teal)',     // Data
    'var(--ef-gold)',     // Knowledge
    'var(--ef-marigold)', // Informed Decision
  ];

  return (
    <section
      ref={sectionRef as any}
      className={[
        'ef-flow relative isolate overflow-hidden',
        theme === 'dark' ? 'ef-dark' : 'ef-light',
        reduce ? 'is-reduced' : '',
      ].join(' ')}
      aria-label="From Market Research to Informed Decision"
    >
      <div className="ef-wrap">
        <p className="ef-kicker">From Research to Action</p>

        <svg viewBox="0 0 1100 280" width="100%" className="ef-svg" role="img" aria-labelledby="efTitle efDesc">
          <title id="efTitle">EcoFocus growth flow</title>
          <desc id="efDesc">Scroll to reveal a gradient flowline and four phase labels.</desc>

          <defs>
            {/* Moving gradient similar to Tailwind animate-gradient */}
            <linearGradient id="efSlideGrad" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#3B82F6" stopOpacity="0.95" />  {/* blue-500 */}
              <stop offset="50%" stopColor="#2DD4BF" stopOpacity="1.0" />    {/* teal-400 */}
              <stop offset="100%" stopColor="#10B981" stopOpacity="1.0" />   {/* emerald-500 */}
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="0 0"
                to="640 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* Mask to clip shimmer to revealed segment */}
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

          {/* Base path */}
          <path
            ref={pathRef}
            d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
            fill="none"
            stroke="var(--ef-emerald)"
            strokeWidth={lineWidth}
            strokeLinecap="round"
            style={revealStyle}
            className="ef-path"
          />

          {/* Gradient shimmer, clipped to revealed portion */}
          {shimmer && (
            <path
              d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
              fill="none"
              stroke="url(#efSlideGrad)"
              strokeWidth={lineWidth + 2}
              strokeLinecap="round"
              mask="url(#efReveal)"
              className="ef-shimmer"
            />
          )}

          {/* Nodes — solid color with a time-based pulse when the reveal crosses each stop */}
          {nodes.map(({ x, y }, i) => (
            <circle
              key={`node-${i}-${pulseVersion[i]}`} // bump key to retrigger CSS animation
              cx={x}
              cy={y}
              r="7"
              className={`ef-node ${reduce ? 'ef-node--static' : 'ef-node--pulse'}`}
              style={{
                '--pulseMs': `${pulseMs}ms`,
              } as React.CSSProperties}
              aria-hidden="true"
            />
          ))}

          {/* Labels — positioned along the path normal so they never sit on the line */}
          {labels.map(({ x, y }, i) => {
            const revealed = progress >= STOPS[i] - 0.02 || reduce;
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor="start"
                style={{
                  font: '700 clamp(13px, 2.0vw, 17px)/1.1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif',
                  fill: labelColors[i],
                  opacity: revealed ? 1 : 0,
                  transform: `translateY(${revealed ? 0 : 6}px)`,
                  transition: 'opacity 300ms ease, transform 300ms ease',
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
          color: rgba(255, 255, 255, 0.65);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 700;
          font-size: 0.8rem;
          margin: 0 0 1.25rem;
        }
        :global(.ef-light) .ef-kicker {
          color: rgba(11, 34, 36, 0.6);
        }
        .ef-svg {
          display: block;
          height: clamp(220px, 28vw, 320px);
          overflow: visible;
        }
        .ef-path {
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
          transition: stroke 200ms ease;
          stroke-dasharray: ${len}px;
          stroke-dashoffset: ${((1 - progress) * len).toFixed(2)}px;
        }
        .ef-shimmer {
          mix-blend-mode: screen;
          opacity: 0.9;
        }

        /* Nodes: solid color; pulse via CSS when mounted (key bumps remount) */
        .ef-node {
          fill: var(--ef-emerald);
          transform-box: fill-box;
          transform-origin: center;
          pointer-events: none;
        }
        .ef-node--static { opacity: 1; }
        .ef-node--pulse {
          opacity: 0;
          animation: nodePulse var(--pulseMs, 750ms) ease-in-out both;
        }
        @keyframes nodePulse {
          0%   { opacity: 0;   transform: scale(0.85); }
          40%  { opacity: 1;   transform: scale(1.22); }
          100% { opacity: 0;   transform: scale(0.9); }
        }

        /* Reduced motion: final state, shimmer calmer */
        .is-reduced .ef-shimmer { opacity: 0.6; }
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
function computeProgress(section: HTMLElement | null, startAt: number, completeAt: number) {
  if (!section) return 0;
  const r = section.getBoundingClientRect();
  const vh = window.innerHeight || 0;

  // Map section.top from startAt*vh → completeAt*vh into 0..1
  const startY = vh * clamp(startAt, 0, 1);
  const endY = vh * clamp(completeAt, 0, 1);
  const a = Math.min(startY, endY);
  const b = Math.max(startY, endY);
  const denom = Math.max(1, b - a);
  const raw = (a - r.top) / denom;
  return clamp(raw, 0, 1);
}
