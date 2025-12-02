"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type StatTheme = "emerald" | "slate" | "marigold";

type Stat = {
  label: string;
  value: string;
  icon: string;
  theme: StatTheme;
};

const THEMES: Record<
  StatTheme,
  {
    panel: string;
    ring: string;
    value: string;
    label: string;
    iconWrap: string;
    icon: string;
  }
> = {
  emerald: {
    panel: "bg-gradient-to-br from-emerald-600 to-emerald-700",
    ring: "ring-emerald-500/30",
    value: "text-white",
    label: "text-emerald-50/95",
    iconWrap: "bg-emerald-500/25 ring-1 ring-emerald-300/40",
    icon: "text-white",
  },
  slate: {
    panel: "bg-gradient-to-br from-[#0F1A28] to-[#0B1320]",
    ring: "ring-white/15",
    value: "text-white",
    label: "text-slate-200/90",
    iconWrap: "bg-white/10 ring-1 ring-white/20",
    icon: "text-white",
  },
  marigold: {
    panel: "bg-gradient-to-br from-[#F8B84A] to-[#EF9601]",
    ring: "ring-[#b26d00]/25",
    value: "text-slate-900",
    label: "text-slate-900/80",
    iconWrap: "bg-white/60 ring-1 ring-white/70",
    icon: "text-slate-900",
  },
};

export default function CustomMethodologyStripe() {
  const reduce = useReducedMotion();

  // ✔ Custom Studies stats (not syndicated stats)
  const stats: Stat[] = [
    {
      label: "Years Tracking Sustainability",
      value: "13+",
      icon: "ri-bar-chart-2-line",
      theme: "emerald",
    },
    {
      label: "Sample Size",
      value: "N = Custom",
      icon: "ri-group-line",
      theme: "slate",
    },
    {
      label: "Typical Custom Timeline",
      value: "4–8 weeks",
      icon: "ri-equalizer-line",
      theme: "marigold",
    },
    {
      label: "Design Options Available",
      value: "Quant • Qual • Hybrid",
      icon: "ri-calendar-line",
      theme: "emerald",
    },
  ];

  return (
    <section aria-labelledby="methodology-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <motion.h2
          id="methodology-heading"
          initial={reduce ? false : { opacity: 0, y: -12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
          className="text-center font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5.2vw,2.3rem)]"
        >
          Background & Methodology Snapshot
        </motion.h2>

        {/* ✔ THIS is the custom copy you wanted */}
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="mx-auto mt-4 max-w-3xl text-center text-slate-600"
        >
          Custom Studies are grounded in the same rigorous EcoFocus trend
          engine—representative sampling, proven sustainability metrics, and
          research design best practices—then tailored to your audience,
          decisions, and category. Every project blends methodological
          discipline with sustainability expertise to deliver defensible,
          decision-ready insights.
        </motion.p>

        {/* Metrics Grid */}
        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6 md:gap-8"
        >
          {stats.map((stat, i) => {
            const t = THEMES[stat.theme];
            return (
              <motion.div
                key={stat.label}
                layout
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 36,
                  mass: 0.7,
                  delay: i * 0.06,
                }}
                whileHover={reduce ? {} : { y: -4 }}
                className={`relative rounded-2xl ring-1 ${t.ring} ${t.panel} shadow-[0_18px_44px_-18px_rgba(3,10,20,.45)]`}
                style={{ willChange: "transform" }}
              >
                {/* Hover sheen */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(100deg,transparent 35%,rgba(255,255,255,.18) 50%,transparent 70%)",
                  }}
                />

                <div className="relative z-10 px-5 py-6 sm:px-6 sm:py-7 flex items-center sm:block gap-4">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${t.iconWrap}`}
                  >
                    <i className={`${stat.icon} text-2xl ${t.icon}`} />
                  </span>

                  <div className="min-w-0">
                    <div
                      className={`mt-0 sm:mt-3 text-3xl sm:text-4xl font-semibold tracking-tight ${t.value}`}
                    >
                      {stat.value}
                    </div>
                    <div className={`mt-1 text-sm sm:text-base ${t.label}`}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}






