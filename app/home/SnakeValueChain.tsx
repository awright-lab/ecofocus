'use client';

import { motion } from "framer-motion";
import React, { useMemo, useRef, useLayoutEffect, useState } from "react";

type Item = { id: string; title: string; body?: string };

type Point = { x: number; y: number };

function bezierPath(a: Point, b: Point) {
  const dx = (b.x - a.x) * 0.35; // curve control strength
  const c1: Point = { x: a.x + dx, y: a.y };
  const c2: Point = { x: b.x - dx, y: b.y };
  return `M ${a.x},${a.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`;
}

export default function SnakeValueChain() {
  const items = React.useMemo<Item[]>(() => [
    {
      id: "1",
      title: "Market Research",
      body: "Syndicated & custom studies uncover real attitudes and drivers."
    },
    {
      id: "2",
      title: "Data",
      body: "Validated, census-balanced data with rigorous methodology."
    },
    {
      id: "3",
      title: "Knowledge",
      body: "Insights that separate intent from action — the say–do gap."
    },
    {
      id: "4",
      title: "Informed Decisions",
      body: "Clear moves for product, packaging, and go-to-market."
    }
  ], []);


  const cardWidth = 320;
  const cardGapY = 120; // tighter spacing
  const lineStroke = 3;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSvgSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // card positions alternating left/right
  const positions = useMemo(() => {
    const padX = 24;
    const leftX = padX + cardWidth / 2;
    const rightX = (svgSize.w || 800) - padX - cardWidth / 2;
    return items.map((_, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? leftX : rightX;
      const y = 40 + i * cardGapY;
      return { x, y, isLeft };
    });
  }, [items, svgSize.w, cardWidth, cardGapY]);

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
            From{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600">
              Research
            </span>{" "}
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

        {/* Snake Path Container */}
        <div ref={wrapRef} className="relative w-full" style={{ padding: "20px 0" }}>
          {/* connectors */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height={svgSize.h}
            viewBox={`0 0 ${Math.max(svgSize.w, 800)} ${Math.max(svgSize.h, 200)}`}
            preserveAspectRatio="none"
          >
            {positions.slice(0, -1).map((p, i) => {
              const n = positions[i + 1];
              const path = bezierPath(p, n);
              return (
                <motion.path
                  key={`path-${i}`}
                  d={path}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth={lineStroke}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    delay: i * 0.15
                  }}
                />
              );
            })}
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>

          {/* cards */}
          {positions.map((pos, i) => {
            const x = pos.x - cardWidth / 2;
            const y = pos.y - 60; // adjust to card height

            return (
              <motion.div
                key={items[i].id}
                className="absolute bg-white rounded-2xl shadow-lg p-5 border border-gray-200"
                style={{
                  width: cardWidth,
                  left: x,
                  top: y,
                  transformOrigin: pos.isLeft ? "left center" : "right center",
                }}
                initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.96,
                  rotate: pos.isLeft ? -2 : 2
                }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
                  delay: i * 0.08
                }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                  transition: {
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  }
                }}
              >
                <div className="text-sm font-bold uppercase tracking-wide bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold mt-1 text-gray-900">{items[i].title}</h3>
                {items[i].body && <p className="text-gray-600 mt-2">{items[i].body}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

