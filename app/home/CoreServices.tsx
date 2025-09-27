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
};

interface Props {
  services?: Service[];
}

export default function CoreServices({ services }: Props) {
  const reduceMotion = useReducedMotion();

  // Three pillars (already merged Syndicated + Dashboard)
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

  const items = (services ?? fallback);

  return (
    <section
      aria-labelledby="core-services-heading"
      className="relative bg-gradient-to-b from-white to-gray-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] tracking-wide">
          <span
            className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
            aria-hidden="true"
          />
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
          A modern, powerful stack: our annual syndicated study (delivered through an interactive dashboard), seamless data integration to enrich your models, and bespoke research for the questions only you can ask.
        </p>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-8 mt-12">
          {items.map((s, i) => (
            <motion.article
              key={s.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="
                group relative h-full overflow-hidden rounded-2xl
                bg-white ring-1 ring-gray-100
                shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)]
                hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.12)]
                transition
                grid grid-rows-[auto_184px_auto_1fr_auto]
              "
            >
              {/* 1) Title + Kicker */}
              <div className="relative p-6 pb-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 leading-snug line-clamp-2">
                  {s.title}
                </h3>
                <div className="mt-1 flex items-start gap-2 text-sm text-emerald-600 leading-snug">
                  {s.icon ? (
                    <i
                      aria-hidden
                      className={`${s.icon} mt-[2px] text-base shrink-0 text-emerald-500`}
                    />
                  ) : null}
                  <span>{s.kicker ?? '\u00A0'}</span>
                </div>
              </div>

              {/* 2) Image */}
              <div className="relative mx-6 h-[184px] overflow-hidden rounded-xl ring-1 ring-gray-100">
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

              {/* 5) CTA */}
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
                    Learn more
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}


