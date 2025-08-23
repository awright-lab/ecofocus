// app/components/SnakeValueChain.tsx
'use client';

import React, { useMemo, useRef, useLayoutEffect, useState} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Database, Lightbulb, TrendingUp, ChevronDown } from 'lucide-react';

type Item = {
  id: string;
  title: string;
  body?: string;
  icon: React.ReactNode;
  grad: string;   // gradient for header band
  solid: string;  // solid color class (e.g., bg-emerald-700) used for “arm”
};

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

function CenterArrow() {
  return (
    <div className="my-3 flex justify-center" aria-hidden="true">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-200">
        <ChevronDown className="h-5 w-5 text-emerald-600" />
      </div>
    </div>
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
        grad: 'from-emerald-800 to-emerald-600', // dark green
        solid: 'bg-emerald-700',
      },
      {
        id: '2',
        title: 'Data',
        body: 'Validated, census-balanced data with rigorous methodology.',
        icon: <Database className="h-6 w-6 text-white" aria-hidden="true" />,
        grad: 'from-emerald-500 to-teal-400', // lighter green
        solid: 'bg-emerald-500',
      },
      {
        id: '3',
        title: 'Knowledge',
        body: 'Insights that separate intent from action — the say–do gap.',
        icon: <Lightbulb className="h-6 w-6 text-white" aria-hidden="true" />,
        grad: 'from-cyan-500 to-sky-500', // blue
        solid: 'bg-cyan-500',
      },
      {
        id: '4',
        title: 'Informed Decisions',
        body: 'Clear moves for product, packaging, and go-to-market.',
        icon: <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />,
        grad: 'from-amber-500 to-orange-400', // marigold
        solid: 'bg-amber-500',
      },
    ],
    []
  );

  if (isMdUp !== true) return <MobileFlow items={items} reduceMotion={reduceMotion} />;
  return <SnakeDesktop items={items} reduceMotion={reduceMotion} />;
}

/* ========================= MOBILE ========================= */

function MobileFlow({ items, reduceMotion }: { items: Item[]; reduceMotion: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLElement | null)[]>([]);
  const [trackY, setTrackY] = useState<number[]>([]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const baseTop = el.getBoundingClientRect().top + window.scrollY;
      const ys: number[] = [];
      stepRefs.current.forEach((r, i) => {
        if (!r) return;
        const rect = r.getBoundingClientRect();
        ys.push(rect.top + window.scrollY - baseTop + rect.height / 2);
        if (i < items.length - 1) {
          const ar = arrowRefs.current[i];
          if (ar) {
            const aRect = ar.getBoundingClientRect();
            ys.push(aRect.top + window.scrollY - baseTop + aRect.height / 2);
          }
        }
      });
      setTrackY(ys);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    stepRefs.current.forEach((r) => r && ro.observe(r));
    arrowRefs.current.forEach((r) => r && ro.observe(r));

    const onScroll = () => measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, [items.length]);

  const times = React.useMemo(() => {
    if (trackY.length < 2) return [];
    const dists = trackY.map((y, i) => (i === 0 ? 0 : Math.abs(y - trackY[i - 1])));
    const total = dists.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    return trackY.map((_, i) => {
      if (i === 0) return 0;
      acc += dists[i] / total;
      return +acc.toFixed(4);
    });
  }, [trackY]);

  return (
    <section className="relative isolate bg-[linear-gradient(180deg,#E0F4FF_0%,white_80%)]" aria-labelledby="snake-value-chain">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="mb-6 text-center sm:mb-8">
          <h2 id="snake-value-chain" className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)]">
            From{' '}
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Research
            </span>{' '}
            to Action
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Market Research → Data → Knowledge → Informed Decisions
          </p>
        </div>

        <div ref={containerRef} className="relative mx-auto max-w-2xl">
          <div className="absolute left-2 top-0 h-full w-px bg-emerald-200" aria-hidden="true" />

          {!reduceMotion && trackY.length >= 2 && (
            <motion.div
              className="pointer-events-none absolute left-[1.25rem] h-3 w-3 rounded-full bg-gradient-to-br from-white to-emerald-200 shadow-md ring-2 ring-emerald-500"
              animate={{ y: trackY }}
              transition={{ duration: 6, times, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateX(-50%)' }}
              aria-hidden="true"
            />
          )}

          <ol className="relative border-l border-transparent pl-5">
            {items.map((it, i) => (
              <React.Fragment key={it.id}>
                <li className="mb-4 last:mb-0">
                  <div className="absolute -left-2.5 grid h-5 w-5 place-items-center rounded-full bg-white ring-2 ring-emerald-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  </div>

                  <article
                    ref={(el) => { stepRefs.current[i] = el; }}  // ✅ return void
                    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -left-6 top-8 h-1 w-6 rounded-full bg-current opacity-80 ${it.solid.replace('bg-', 'text-')}`}
                    />
                    <div className={`flex items-center justify-between bg-gradient-to-r ${it.grad} px-4 py-2`}>
                      <span className="sr-only">Step header</span>
                      <span className="h-5 w-5 rounded-md bg-white/20 ring-1 ring-white/30 backdrop-blur-sm" />
                      {it.icon}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{it.title}</h3>
                      {it.body && <p className="mt-1 text-sm text-gray-600">{it.body}</p>}
                    </div>
                  </article>
                </li>

                {i < items.length - 1 && (
                  <div ref={(el) => { arrowRefs.current[i] = el; }}>  {/* ✅ return void */}
                    <CenterArrow />
                  </div>
                )}
              </React.Fragment>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ========================= DESKTOP (unchanged snake) ========================= */

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
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
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
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
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

          {positions.map((pos, i) => {
            const CARD_W = pos.CARD_W!;
            const left = pos.x - CARD_W / 2;
            const top = pos.y - 160 / 2;
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
                aria-label={it.title}
              >
                <div className={`flex items-center justify-between bg-gradient-to-r ${it.grad} px-4 py-2`}>
                  <span className="h-5 w-5 rounded-md bg-white/20 ring-1 ring-white/30 backdrop-blur-sm" aria-hidden="true" />
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












