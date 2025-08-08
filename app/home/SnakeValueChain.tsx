'use client';

import { motion } from 'framer-motion';
import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { Search, Database, Lightbulb, TrendingUp } from 'lucide-react'; // Example icons

type Item = { id: string; title: string; body?: string; icon: React.ReactNode };
type Point = { x: number; y: number };

function snakeBezier(a: Point, b: Point, wave: number) {
  const dx = (b.x - a.x) * 0.35;
  const c1: Point = { x: a.x + dx, y: a.y + wave };
  const c2: Point = { x: b.x - dx, y: b.y - wave };
  return `M ${a.x},${a.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`;
}

export default function SnakeValueChain() {
  const items = useMemo<Item[]>(
    () => [
      {
        id: '1',
        title: 'Market Research',
        body: 'Syndicated & custom studies uncover real attitudes and drivers.',
        icon: <Search className="w-8 h-8 text-emerald-700" />,
      },
      {
        id: '2',
        title: 'Data',
        body: 'Validated, census-balanced data with rigorous methodology.',
        icon: <Database className="w-8 h-8 text-teal-600" />,
      },
      {
        id: '3',
        title: 'Knowledge',
        body: 'Insights that separate intent from action — the say–do gap.',
        icon: <Lightbulb className="w-8 h-8 text-cyan-500" />,
      },
      {
        id: '4',
        title: 'Informed Decisions',
        body: 'Clear moves for product, packaging, and go-to-market.',
        icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
      },
    ],
    []
  );

  const cardWidth = 320;
  const cardHeight = 160;
  const verticalGap = 120;
  const lineStroke = 4;
  const cardEdgeInset = 12;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const lastRow = (items.length - 1) * verticalGap + 40;
      const neededHeight = lastRow + cardHeight / 2 + 60;
      setSvgSize({ w: el.clientWidth, h: Math.max(neededHeight, el.clientHeight) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  const positions = useMemo(() => {
    const padX = 24;
    const leftX = padX + cardWidth / 2;
    const rightX = (svgSize.w || 800) - padX - cardWidth / 2;

    return items.map((_, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? leftX : rightX;
      const y = 40 + i * verticalGap;
      return { x, y, isLeft };
    });
  }, [items, svgSize.w]);

  return (
    <section className="relative py-16 bg-white" aria-labelledby="snake-value-chain">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <motion.h2
            id="snake-value-chain"
            className="text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            From{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500">
              Research
            </span>{' '}
            to Action
          </motion.h2>
          <motion.p
            className="text-gray-600 mt-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            MARKET RESEARCH = DATA → DATA = KNOWLEDGE → KNOWLEDGE = INFORMED DECISIONS
          </motion.p>
        </div>

        {/* Path + Cards */}
        <div
          ref={wrapRef}
          className="relative w-full overflow-visible pb-20"
          style={{ minHeight: positions.length ? positions.at(-1)!.y + cardHeight : 240 }}
        >
          {/* SVG connectors */}
          <svg
            className="absolute inset-0 pointer-events-none overflow-visible"
            width="100%"
            height={svgSize.h}
            viewBox={`0 0 ${Math.max(svgSize.w, 800)} ${svgSize.h || 200}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="50%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {positions.slice(0, -1).map((p, i) => {
              const n = positions[i + 1];
              const startX = p.isLeft ? p.x + cardWidth / 2 - cardEdgeInset : p.x - cardWidth / 2 + cardEdgeInset;
              const endX = n.isLeft ? n.x - cardWidth / 2 + cardEdgeInset : n.x + cardWidth / 2 - cardEdgeInset;
              const wave = (i % 2 === 0 ? 1 : -1) * 60;
              const path = snakeBezier({ x: startX, y: p.y }, { x: endX, y: n.y }, wave);

              return (
                <motion.path
                  key={`path-${i}`}
                  d={path}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth={lineStroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.12,
                  }}
                />
              );
            })}
          </svg>

          {/* Cards */}
          {positions.map((pos, i) => {
            const left = pos.x - cardWidth / 2;
            const top = pos.y - cardHeight / 2;

            return (
              <motion.div
                key={items[i].id}
                className="absolute bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                style={{
                  width: cardWidth,
                  left,
                  top,
                  transformOrigin: pos.isLeft ? 'left center' : 'right center',
                }}
                initial={{ opacity: 0, y: 20, scale: 0.96, rotate: pos.isLeft ? -2 : 2 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-emerald-700 to-cyan-500 text-white mb-4">
                  {items[i].icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{items[i].title}</h3>
                {items[i].body && <p className="text-gray-600 mt-2">{items[i].body}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}




