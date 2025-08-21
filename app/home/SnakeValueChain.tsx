// app/components/SnakeValueChain.tsx
'use client';

import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Database, Lightbulb, TrendingUp } from 'lucide-react';

type Item = { id: string; title: string; body?: string; icon: React.ReactNode; gradient: string };
type Point = { x: number; y: number };

function snakeBezier(a: Point, b: Point, wave: number) {
  const dx = (b.x - a.x) * 0.35;
  const c1: Point = { x: a.x + dx, y: a.y + wave };
  const c2: Point = { x: b.x - dx, y: b.y - wave };
  return `M ${a.x},${a.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`;
}

function useIsMdUp() {
  const [ok, setOk] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setOk(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return ok;
}

/* ========= Animated labeled connector (mobile) ========= */
function StepConnector({
  from,
  to,
  index,
  reduceMotion,
}: {
  from: string;
  to: string;
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="my-3 flex justify-center"
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      aria-hidden="true"
    >
      <div className="relative h-8 w-[min(440px,84%)] overflow-hidden">
        {/* Expanding bar */}
        <motion.div
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500"
          initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Flow shimmer */}
        {!reduceMotion && (
          <motion.span
            className="pointer-events-none absolute top-0 h-full w-24 bg-white/20 blur-md"
            initial={{ left: '-20%' }}
            whileInView={{ left: '110%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'linear', delay: 0.15 }}
          />
        )}
        {/* Label */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-xs font-semibold tracking-wide text-white">
          <span className="truncate">{from}</span>
          <span className="mx-2">→</span>
          <span className="truncate">{to}</span>
        </div>
        {/* Arrowhead */}
        <motion.span
          className="absolute left-full top-1/2 -translate-y-1/2 h-0 w-0 border-y-[8px] border-y-transparent border-l-[10px] border-l-cyan-500"
          initial={reduceMotion ? { x: 0, opacity: 1 } : { x: -12, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.45 }}
        />
      </div>
    </motion.div>
  );
}

export default function SnakeValueChain() {
  const reduceMotion = !!useReducedMotion();
  const isMdUp = useIsMdUp();

  const items = useMemo<Item[]>(
    () => [
      {
        id: '1',
        title: 'Market Research',
        body: 'Syndicated & custom studies uncover real attitudes and drivers.',
        icon: <Search className="h-6 w-6 text-white" aria-hidden="true" />,
        gradient: 'from-emerald-700 to-teal-500',
      },
      {
        id: '2',
        title: 'Data',
        body: 'Validated, census-balanced data with rigorous methodology.',
        icon: <Database className="h-6 w-6 text-white" aria-hidden="true" />,
        gradient: 'from-teal-500 to-cyan-500',
      },
      {
        id: '3',
        title: 'Knowledge',
        body: 'Insights that separate intent from action — the say–do gap.',
        icon: <Lightbulb className="h-6 w-6 text-white" aria-hidden="true" />,
        gradient: 'from-cyan-500 to-emerald-500',
      },
      {
        id: '4',
        title: 'Informed Decisions',
        body: 'Clear moves for product, packaging, and go-to-market.',
        icon: <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />,
        gradient: 'from-emerald-500 to-amber-400',
      },
    ],
    []
  );

  /* ---------- MOBILE: timeline + animated labeled connectors ---------- */
  if (isMdUp !== true) {
    return (
      <section className="relative isolate bg-[linear-gradient(180deg,#E0F4FF_0%,white_80%)]" aria-labelledby="snake-value-chain">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
          <div className="mb-6 text-center sm:mb-8">
            <h2 id="snake-value-chain" className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)]">
              From{' '}
              <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 bg-clip-text text-transparent">
                Research
              </span>{' '}
              to Action
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Market Research → Data → Knowledge → Informed Decisions
            </p>
          </div>

          {/* Vertical timeline */}
          <ol className="relative mx-auto max-w-2xl border-l border-emerald-200 pl-5">
            {items.map((it, i) => (
              <React.Fragment key={it.id}>
                <motion.li
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="mb-4 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-2.5 grid h-5 w-5 place-items-center rounded-full bg-white ring-2 ring-emerald-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>

                  {/* Card */}
                  <article className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    {/* Arm from spine into header */}
                    <motion.span
                      aria-hidden="true"
                      className={`absolute -left-6 top-8 h-1 rounded-full bg-gradient-to-r ${it.gradient}`}
                      initial={reduceMotion ? { width: 24 } : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: 24 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.35 }}
                    />

                    {/* Gradient header */}
                    <div className={`mb-3 flex items-center justify-between rounded-xl bg-gradient-to-r ${it.gradient} px-4 py-2`}>
                      <span className="text-sm font-bold text-white">{String(i + 1).padStart(2, '0')}</span>
                      {it.icon}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">{it.title}</h3>
                    {it.body && <p className="mt-1 text-sm text-gray-600">{it.body}</p>}

                    {/* Downward tail (grows) */}
                    {i !== items.length - 1 && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute left-1/2 -bottom-3 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400"
                        initial={reduceMotion ? { height: 20 } : { height: 0 }}
                        whileInView={reduceMotion ? undefined : { height: 20 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                      />
                    )}
                  </article>
                </motion.li>

                {/* Animated connector between steps */}
                {i < items.length - 1 && (
                  <StepConnector
                    from={items[i].title}
                    to={items[i + 1].title}
                    index={i}
                    reduceMotion={reduceMotion}
                  />
                )}
              </React.Fragment>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  /* ---------- DESKTOP: original snake layout (unchanged) ---------- */
  return <SnakeDesktop items={items} reduceMotion={reduceMotion} />;
}

/* ================= Desktop snake (unchanged visuals) ================= */

function SnakeDesktop({ items, reduceMotion }: { items: Item[]; reduceMotion: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const CARD_H = 160;
  const V_GAP = 120;
  const LINE = 4;
  const EDGE = 12;

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const lastRow = (items.length - 1) * V_GAP + 40;
      const neededHeight = lastRow + CARD_H / 2 + 80;
      setSvgSize({ w: el.clientWidth, h: Math.max(neededHeight, el.clientHeight) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  const positions = useMemo(() => {
    const padX = 24;
    const CARD_W = Math.max(260, Math.min(360, svgSize.w * 0.38));
    const leftX = padX + CARD_W / 2;
    const rightX = (svgSize.w || 800) - padX - CARD_W / 2;
    return items.map((_, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? leftX : rightX;
      const y = 40 + i * V_GAP;
      return { x, y, isLeft, CARD_W };
    });
  }, [items, svgSize.w]);

  return (
    <section className="relative isolate bg-[linear-gradient(180deg,#E0F4FF_0%,white_80%)]" aria-labelledby="snake-value-chain">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 text-center">
          <h2 id="snake-value-chain" className="font-bold leading-tight text-gray-900 text-[clamp(1.8rem,3.6vw,2.5rem)]">
            From{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Research
            </span>{' '}
            to Action
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
            Market Research → Data → Knowledge → Informed Decisions
          </p>
        </div>

        <div
          ref={wrapRef}
          className="relative w-full overflow-visible pb-24"
          style={{ minHeight: positions.length ? positions.at(-1)!.y + CARD_H : 240 }}
        >
          {/* Curvy connectors */}
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width="100%"
            height={svgSize.h}
            viewBox={`0 0 ${Math.max(svgSize.w, 800)} ${svgSize.h || 200}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="50%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {positions.slice(0, -1).map((p, i) => {
              const n = positions[i + 1];
              const CARD_W = p.CARD_W!;
              const startX = p.isLeft ? p.x + CARD_W / 2 - EDGE : p.x - CARD_W / 2 + EDGE;
              const endX = n.isLeft ? n.x - CARD_W / 2 + EDGE : n.x + CARD_W / 2 - EDGE;
              const wave = (i % 2 === 0 ? 1 : -1) * 60;
              const d = snakeBezier({ x: startX, y: p.y }, { x: endX, y: n.y }, wave);

              return (
                <motion.path
                  key={`path-${i}`}
                  d={d}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth={LINE}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                />
              );
            })}
          </svg>

          {/* Cards */}
          {positions.map((pos, i) => {
            const CARD_W = pos.CARD_W!;
            const left = pos.x - CARD_W / 2;
            const top = pos.y - CARD_H / 2;
            const it = items[i];

            return (
              <motion.article
                key={it.id}
                className="absolute overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition"
                style={{ width: CARD_W, left, top, transformOrigin: pos.isLeft ? 'left center' : 'right center' }}
                initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96, rotate: pos.isLeft ? -2 : 2 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}
                aria-label={`${i + 1}. ${it.title}`}
              >
                <div className={`flex items-center justify-between bg-gradient-to-r ${it.gradient} px-4 py-2`}>
                  <span className="text-sm font-bold text-white">{String(i + 1).padStart(2, '0')}</span>
                  {it.icon}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{it.title}</h3>
                  {it.body && <p className="mt-2 text-sm text-gray-600">{it.body}</p>}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}










