"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function SolutionsOverview() {
  const reduceMotion = useReducedMotion();

  const cards = [
    {
      tag: "Fastest",
      title: "Interactive Dashboard",
      body:
        "Pitch-ready charts and filters over 13+ years of EcoFocus data. Great for POVs, briefs, and approvals—today.",
      bullets: [
        "Immediate answers for pitches & POVs",
        "Gen Z / Millennial cuts, segments & trends",
        "Export charts to slides or CSV",
      ],
      href: "#compare",
      hrefSecondary: "/contact",
    },
    {
      tag: "Most-used by agencies",
      title: "Syndicated Study",
      body:
        "Nationally representative tracking since 2010—large samples and defendable MoE, with optional custom modules.",
      bullets: [
        "n≈4,000 per wave; ±1.55% MoE (nat’l)",
        "Add proprietary questions (buy-ins)",
        "Dashboard seats & white-label charts",
      ],
      href: "/solutions/syndicated",
      hrefSecondary: "#featured",
    },
    {
      tag: "Most versatile",
      title: "Data Integration",
      body:
        "Blend EcoFocus benchmarks with client sales, CRM or BI to sharpen personas and validate claims before launch.",
      bullets: [
        "Secure merges; schema & data dictionary",
        "CSV/Parquet deliveries or bucket access",
        "API option for enterprise",
      ],
      href: "#featured",
      hrefSecondary: "/contact",
    },
    {
      tag: "Deepest evidence",
      title: "Custom Studies",
      body:
        "Audience, claims, pricing, packs, concept tests—mix qual + quant to answer the question you have to defend.",
      bullets: [
        "Method scoped to decision",
        "Say–do gap diagnostics",
        "Executive-ready reporting",
      ],
      href: "/solutions/custom",
      hrefSecondary: "/contact",
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="solutions-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="solutions-overview"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Solutions that power agencies
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-3 max-w-3xl text-center text-sm sm:text-base text-gray-700"
        >
          Pick the path that fits your brief. All options include clear methodology and
          agency-ready outputs.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                {c.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{c.body}</p>
              <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
                {c.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2">
                <Link
                  href={c.href}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Learn more
                </Link>
                <Link
                  href={c.hrefSecondary}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Talk to us
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}


