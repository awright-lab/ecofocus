// app/components/CoreServices.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type Service = {
  title: string;
  kicker?: string;
  description: string;
  href?: string;
  image?: string;
  bullets?: string[];
  icon?: string;
  statusNote?: string; // tiny caption under CTA (used on card 1)
};

interface Props {
  services?: Service[];
}

export default function CoreServices({ services }: Props) {
  const reduceMotion = useReducedMotion();

  const fallback: Service[] = [
    {
      title: 'Syndicated Study + Interactive Dashboard',
      kicker: 'Annual study. Executive-ready insights. Delivered via dashboard.',
      description:
        'Our flagship, census-balanced study runs once per year—current fielding is complete. Teams license seat access to explore findings in the EcoFocus Interactive Dashboard with fast crosstabs, charts, and exports.',
      href: '/solutions/syndicated',
      image: '/images/solutions-syndicated.png',
      bullets: [
        '4,000+ U.S. respondents (Gen Pop)',
        'Census-balanced; MoE ≈ ±1.55%',
        'Seat licensing + onboarding',
      ],
      icon: 'ri-bar-chart-2-line',
      statusNote: 'Fielding complete for 2025 · Seat licensing available',
    },
    {
      title: 'Data Integration',
      kicker: 'Infuse your current data with EcoFocus insights.',
      description:
        'By infusing our sustainability data into your existing research, we uncover actionable insights that guide product development and marketing strategy. Our data enriches your understanding of eco-conscious consumers—empowering you to connect with your target market in a meaningful way. With 13 years of syndicated research, a 4,000-respondent sample, and a ~1.55% margin of error, we integrate cleanly into your stack and strengthen your models.',
      href: '/solutions/enhance-your-data',
      image: '/images/solutions-infusion.png',
      bullets: [
        'Secure data exchange (files or data share)',
        'Schema mapping & QA support',
        'Optional dashboard overlay for teams',
      ],
      icon: 'ri-database-2-line',
    },
    {
      title: 'Custom Studies',
      kicker: 'Answer your exact questions.',
      description:
        'When your clients face unique questions, our team designs fast, credible, and campaign-ready studies. We blend quant and qual to deliver clarity with executive-ready storytelling.',
      href: '/solutions/custom',
      image: '/images/solutions-custom.png',
      bullets: ['Quant & qual design', 'Rapid polls & deep dives', 'Executive-ready deliverables'],
      icon: 'ri-flask-line',
    },
  ];

  const items = services ?? fallback;

  return (
    <section
      aria-labelledby="core-services-heading"
      className="
        relative
        /* Section frame: faint wash + radial accents */
        bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]
        before:pointer-events-none before:absolute before:inset-0
        before:bg-[radial-gradient(60rem_40rem_at_10%_-10%,rgba(16,185,129,0.06),transparent_60%),radial-gradient(48rem_32rem_at_120%_-20%,rgba(59,130,246,0.05),transparent_60%)]
        before:content-['']
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-emerald-700 font-medium">Core Services</span>
        </div>

        {/* Heading */}
        <h3
          id="core-services-heading"
          className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
        >
          Three Pillars That Power Your Sustainability Advantage
        </h3>
        <p className="mt-3 text-base md:text-lg text-slate-600 max-w-3xl">
          A modern, powerful stack: our annual syndicated study (delivered through an interactive dashboard), seamless data
          integration to enrich your models, and bespoke research for the questions only you can ask.
        </p>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-8 mt-12">
          {items.map((s, i) => (
            <motion.div
              key={s.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              /* Gradient hairline frame (premium) */
              className="
                relative p-[1px] rounded-[1.05rem]
                bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]
              "
            >
              <article
                className="
                  group relative h-full overflow-hidden rounded-[1rem]
                  bg-white ring-1 ring-gray-100
                  shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)]
                  transition
                  grid grid-rows-[auto_188px_auto_1fr_auto]
                  /* Micro sheen on hover */
                  after:pointer-events-none after:absolute after:inset-0
                  after:bg-[linear-gradient(100deg,transparent_35%,rgba(56,189,248,0.16)_50%,transparent_70%)]
                  after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500
                "
              >
                {/* Number chip */}
                <span
                  className="
                    absolute left-4 top-4 z-10 inline-flex items-center gap-1
                    rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-gray-200
                  "
                >
                  <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </span>

                {/* 1) Title + Kicker */}
                <div className="relative p-6 pb-4">
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 leading-snug line-clamp-2">
                    {s.title}
                  </h3>
                  <div className="mt-1 flex items-start gap-2 text-sm text-emerald-600 leading-snug">
                    {s.icon ? (
                      <i aria-hidden className={`${s.icon} mt-[2px] text-[1.05rem] shrink-0 text-emerald-500`} />
                    ) : null}
                    <span className="line-clamp-2">{s.kicker ?? '\u00A0'}</span>
                  </div>
                </div>

                {/* 2) Image */}
                <div className="relative mx-6 h-[188px] overflow-hidden rounded-xl ring-1 ring-gray-100">
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width:1280px)30vw,(min-width:1024px)33vw,(min-width:768px)50vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      priority={i < 2}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100" />
                  )}
                  {/* subtle vignette */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_8%,rgba(0,0,0,0.1),transparent_60%)]"
                  />
                </div>

                {/* 3) Description */}
                <div className="relative px-6 pt-5">
                  <p className="text-[15px] text-slate-700 leading-relaxed line-clamp-4">
                    {s.description}
                  </p>
                </div>

                {/* 4) Bullets */}
                <div className="relative px-6 pt-4 pb-2">
                  {s.bullets && s.bullets.length > 0 ? (
                    <ul className="grid gap-1.5">
                      {s.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-slate-600">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {/* 5) CTA + status */}
                <div className="relative p-6 pt-3">
                  {s.href && (
                    <Link
                      href={s.href}
                      className="
                        inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                        text-white bg-emerald-600 hover:bg-emerald-700 active:translate-y-[1px]
                        transition
                      "
                      aria-label={`Learn more about ${s.title}`}
                    >
                      {i === 0 ? 'Explore the study' : i === 1 ? 'See integration options' : 'Start a custom brief'}
                    </Link>
                  )}
                  {s.statusNote && (
                    <p className="mt-2 text-[11px] text-slate-500 text-center">{s.statusNote}</p>
                  )}
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* Mobile stack (kept light; shares the premium border & sheen) */}
        <div className="md:hidden mt-8 grid gap-6">
          {items.map((s, i) => (
            <div
              key={s.title}
              className="
                relative p-[1px] rounded-[1.05rem]
                bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]
              "
            >
              <article
                className="
                  relative overflow-hidden rounded-[1rem] bg-white ring-1 ring-gray-100
                  shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)]
                  grid grid-rows-[auto_164px_auto_1fr_auto]
                  after:absolute after:inset-0
                  after:bg-[linear-gradient(100deg,transparent_35%,rgba(56,189,248,0.16)_50%,transparent_70%)]
                  after:opacity-0 active:after:opacity-100 after:transition-opacity after:duration-500
                "
              >
                <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-gray-200">
                  <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </span>

                <div className="p-5 pb-3">
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug line-clamp-2">
                    {s.title}
                  </h3>
                  <div className="mt-1 flex items-start gap-2 text-sm text-emerald-600">
                    {s.icon ? <i aria-hidden className={`${s.icon} mt-[2px] text-base shrink-0 text-emerald-500`} /> : null}
                    <span className="line-clamp-2">{s.kicker ?? '\u00A0'}</span>
                  </div>
                </div>

                <div className="relative mx-5 h-[164px] overflow-hidden rounded-xl ring-1 ring-gray-100">
                  {s.image ? (
                    <Image src={s.image} alt={s.title} fill sizes="92vw" className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-100" />
                  )}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_8%,rgba(0,0,0,0.1),transparent_60%)]"
                  />
                </div>

                <div className="px-5 pt-3">
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-5">
                    {s.description}
                  </p>
                </div>

                <div className="px-5 pt-3 pb-1">
                  {s.bullets && s.bullets.length > 0 ? (
                    <ul className="grid gap-1.5">
                      {s.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-slate-600">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="p-5 pt-3">
                  {s.href && (
                    <Link
                      href={s.href}
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition active:translate-y-[1px]"
                    >
                      {i === 0 ? 'Explore the study' : i === 1 ? 'See integration options' : 'Start a custom brief'}
                    </Link>
                  )}
                  {s.statusNote && (
                    <p className="mt-2 text-[11px] text-slate-500 text-center">{s.statusNote}</p>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



