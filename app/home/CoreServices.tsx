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
  statusNote?: string;
};

interface Props {
  services?: Service[];
}

/* --- Expandable text (unchanged) --- */
function ExpandableText({
  text,
  initiallyExpanded = false,
  collapseHeight = 136,
}: {
  text: string;
  initiallyExpanded?: boolean;
  collapseHeight?: number;
}) {
  const [expanded, setExpanded] = React.useState(initiallyExpanded);
  return (
    <div className="relative">
      <div
        style={{ maxHeight: expanded ? 'none' : collapseHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        aria-expanded={expanded}
      >
        <p className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-line">
          {text}
        </p>
      </div>
      {!expanded && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
          }}
        />
      )}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  );
}

export default function CoreServices({ services }: Props) {
  const reduceMotion = useReducedMotion();

  const fallback: Service[] = [
    {
      title: 'Syndicated Study',
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
      // no note, but we'll reserve space
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
      // no note, but we'll reserve space
    },
  ];

  const items = services ?? fallback;

  return (
    <section
      aria-labelledby="core-services-heading"
      className="
        relative
        bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]
        before:pointer-events-none before:absolute before:inset-0
        before:bg-[radial-gradient(60rem_40rem_at_10%_-10%,rgba(16,185,129,0.06),transparent_60%),radial-gradient(48rem_32rem_at_120%_-20%,rgba(59,130,246,0.05),transparent_60%)]
        before:content-['']
      "
      /* Alignment tokens */
      style={
        {
          ['--card-hdr' as any]: '164px',  // title+kicker zone (room for number chip row)
          ['--card-img' as any]: '200px',  // image height (identical)
          ['--card-desc' as any]: '184px', // collapsed description height
          ['--card-bul' as any]: '96px',   // bullets block
          ['--card-note' as any]: '20px',  // reserved status line below CTA
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* ... your heading row stays as-is ... */}

        {/* GRID */}
        <div className="hidden md:grid grid-cols-3 gap-8 mt-12">
          {items.map((s, i) => (
            <motion.div
              key={s.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative p-[1px] rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]"
            >
              <article className="h-full rounded-[1rem] bg-white ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)] transition flex flex-col">
                {/* Header (no overlap: number badge is IN FLOW above title) */}
                <div className="px-6 pt-6 pb-4 min-h-[var(--card-hdr)]">
                  {/* number chip row */}
                  <div className="mb-2 flex items-center">
                    <span
                      className="
                        inline-flex items-center justify-center rounded-full px-2.5 py-1
                        text-[11px] font-semibold text-slate-900
                        bg-[#ef9601] shadow-sm
                      "
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-[22px] md:text-[24px] font-semibold tracking-tight text-slate-900 leading-snug">
                    {s.title}
                  </h3>
                  <div className="mt-1 flex items-start gap-2 text-sm text-emerald-600 leading-snug">
                    {s.icon ? (
                      <i
                        aria-hidden
                        className={`${s.icon} mt-[2px] text-[1.05rem] shrink-0 text-emerald-500`}
                      />
                    ) : null}
                    <span>{s.kicker ?? '\u00A0'}</span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative mx-6 h-[var(--card-img)] overflow-hidden rounded-xl ring-1 ring-gray-100">
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width:1280px)30vw,(min-width:1024px)33vw,(min-width:768px)50vw"
                      className="object-cover"
                      priority={i < 2}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100" />
                  )}
                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_8%,rgba(0,0,0,0.1),transparent_60%)]" />
                </div>

                {/* Description */}
                <div className="px-6 pt-5 min-h-[var(--card-desc)]">
                  <ExpandableText text={s.description} collapseHeight={140} />
                </div>

                {/* Bullets */}
                <div className="px-6 pt-2 pb-1 min-h-[var(--card-bul)]">
                  {s.bullets && s.bullets.length > 0 ? (
                    <ul className="grid gap-1.5">
                      {s.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-slate-600">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {/* CTA + reserved status line (uniform across cards) */}
                <div className="px-6 pt-3 mt-auto">
                  {s.href && (
                    <Link
                      href={s.href}
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:translate-y-[1px] transition"
                    >
                      {i === 0 ? 'Explore the study' : i === 1 ? 'See integration options' : 'Start a custom brief'}
                    </Link>
                  )}
                  {/* Reserve the exact same height for note on every card */}
                  <div className="h-[var(--card-note)] flex items-center justify-center">
                    {s.statusNote ? (
                      <p className="mt-2 text-[11px] text-slate-500 text-center">{s.statusNote}</p>
                    ) : (
                      <span className="mt-2 text-[11px] opacity-0 select-none">placeholder</span>
                    )}
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}






