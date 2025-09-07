// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

type Theme = 'light' | 'dark';

const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decision'] as const;
// path stops (start + mids + end) used for dots & label reveals
const STOPS = [0.0, 0.33, 0.66, 0.88, 1.0] as const;

export default function ResearchToAction({
  theme = 'dark',
  respectMotion = true,
  lineWidth = 6,
  startAt = 0.9,     // start drawing when section top reaches 90% of viewport height
  completeAt = 0.45, // fully drawn by the time section top reaches 45% of viewport
  shimmer = true,
}: {
  theme?: Theme;
  respectMotion?: boolean;
  lineWidth?: number;
  startAt?: number;     // 0..1 viewport fraction (lower = earlier)
  completeAt?: number;  // 0..1 viewport fraction (lower = sooner complete)
  shimmer?: boolean;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = respectMotion ? !!prefersReduce : false;

  const sectionRef = React.useRef<HTMLElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);

  const [len, setLen] = React.useState(1);
  const [pts, setPts] = React.useState<{ x: number; y: number }[]>([]);
  const [progress, setProgress] = React.useState(0); // 0..1 scroll-mapped

  // measure path length & node positions (also on resize)
  React.useLayoutEffect(() => {
    const measure = () => {
      const p = pathRef.current;
      if (!p) return;
      const L = p.getTotalLength();
      setLen(L);
      const positions = STOPS.map((t) => {
        const pt = p.getPointAtLength(L * t);
        return { x: pt.x, y: pt.y };
      });
      setPts(positions);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, []);

  // scroll listener (rAF throttled) → progress
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
          const p = computeProgress(el, startAt, completeAt);
          // Use easing so the line appears snappier up front
          setProgress(easeOutCubic(p));
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

  // inline reveal style for stroke-dash (no CSS var collisions)
  const dashOffset = (1 - progress) * len;
  const revealStyle: React.CSSProperties = {
    strokeDasharray: `${len}`,
    strokeDashoffset: `${dashOffset}`,
  };

  // label colors in order, marigold last
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
          <desc id="efDesc">Scroll to reveal the flowline and the four phases.</desc>

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

            {/* Mask matches the revealed (drawn) length so shimmer only shows on visible segment */}
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
            d="M40,220 C220,220 210,90 350,90 S480,220 600,220 S780,90 920,90 S980,220 1060,220"
            fill="none"
            stroke="var(--ef-emerald)"
            strokeWidth={lineWidth}
            strokeLinecap="round"
            style={revealStyle}
            className="ef-path"
          />

          {/* Shimmer overlay, clipped to the revealed portion */}
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

          {/* Dots */}
          {pts.map(({ x, y }, i) => {
            const visible = progress >= STOPS[i] - 0.001;
            return <circle key={i} cx={x} cy={y} r="7" className="ef-dot" style={{ opacity: visible ? 1 : 0 }} />;
          })}

          {/* Labels: light, offset from line so they never overlap */}
          {pts.slice(1).map(({ x, y }, i) => {
            const revealed = progress >= STOPS[i + 1] - 0.001 || reduce;
            const above = i % 2 === 0;
            const dy = above ? -40 : 42; // push away more for readability
            return (
              <text
                key={`label-${i}`}
                x={x + 18}
                y={y + dy}
                textAnchor="start"
                style={{
                  font: '700 clamp(13px, 2.0vw, 17px)/1.1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif',
                  fill: labelColors[i],
                  // ultra-thin outline for contrast on both themes
                  paintOrder: 'stroke',
                  stroke: 'rgba(255,255,255,0.9)',
                  strokeWidth: theme === 'dark' ? 0.5 : 0.35,
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
          stroke-dashoffset: ${dashOffset}px;
        }
        .ef-shimmer {
          mix-blend-mode: screen;
          opacity: 0.9;
        }
        .ef-dot {
          fill: #ffffff;
          stroke: var(--ef-emerald);
          stroke-width: 4;
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.25));
          transition: opacity 220ms ease;
        }

        /* Reduced motion: render final state, keep shimmer static */
        .is-reduced .ef-shimmer {
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
function computeProgress(section: HTMLElement | null, startAt: number, completeAt: number) {
  if (!section) return 0;
  const r = section.getBoundingClientRect();
  const vh = window.innerHeight || 0;

  // Map section.top from startAt*vh → completeAt*vh into 0..1
  const startY = vh * clamp(startAt, 0, 1);
  const endY = vh * clamp(completeAt, 0, 1);
  // handle swapped values gracefully
  const a = Math.min(startY, endY);
  const b = Math.max(startY, endY);
  const denom = Math.max(1, b - a);
  const raw = (a - r.top) / denom;

  return clamp(raw, 0, 1);
}












