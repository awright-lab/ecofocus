// app/components/CoreServices.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

/* Collapsible description with gentle height transition (kept) */
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
  // Three pillars (Syndicated + Dashboard is positioned in copy)
  const fallback: Service[] = [
    {
      title: 'Syndicated Study',
      kicker: 'Annual study. Executive-ready insights.',
      description:
        'Our flagship, census-balanced study runs once per year. Request license seat access to explore 2025 findings in the EcoFocus Interactive Dashboard with fast crosstabs, charts, and exports.',
      href: '/contact',
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
      kicker: 'Enrich your current data with EcoFocus insights.',
      description:
        'Use our sustainability data to give context to your existing customer data.We help you uncover insights that guide product development and marketing strategy. Our data enriches your understanding of eco-conscious consumers—empowering you to connect with your target market in a meaningful way.',
      href: '/contact',
      image: '/images/solutions-infusion.png',
      bullets: [
        'Secure data exchange (files or data share)',
        'Contextualize your customer data with sustainability insights',
        'Indentify growth opportunities in product and marketing strategy',
      ],
      icon: 'ri-database-2-line',
    },
    {
      title: 'Custom Studies',
      kicker: 'Answer the questions that matter to you.',
      description:
        'When you need answers to unique questions, our team will work with you to design and implement a custom study to address your business needs. We can blend quant and qual to deliver the insights to help you connect wiith your customers.',
      href: '/contact',
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
        bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]
        before:pointer-events-none before:absolute before:inset-0
        before:bg-[radial-gradient(60rem_40rem_at_10%_20%,rgba(16,185,129,0.06),transparent_60%),radial-gradient(48rem_32rem_at_120%_-20%,rgba(59,130,246,0.05),transparent_60%)]
        before:content-['']
      "
      /* Alignment tokens for perfect row/CTA baselines */
      style={
        {
          ['--card-hdr' as any]: '164px',  // title + kicker area (includes number chip row)
          ['--card-img' as any]: '200px',  // image height (identical)
          ['--card-desc' as any]: '184px', // description (collapsed block height)
          ['--card-bul' as any]: '96px',   // bullets block height
          ['--card-note' as any]: '20px',  // reserved status line below CTA
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Section badge (static) */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">Core Services</span>
        </div>

        {/* Headline 1/2 width row */}
        <div className="mt-0 md:mt-2 grid grid-cols-1 md:grid-cols-12 md:items-end gap-4 md:gap-6">
          <h3
            id="core-services-heading"
            className="md:col-span-6 font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
          >
            Solutions That Power Growth Across Every{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Industry
            </span>
          </h3>
          <p className="md:col-span-6 text-base md:text-lg text-slate-600">
            From syndicated data to custom studies, EcoFocus helps brands and agencies translate sustainability attitudes into
            strategies that work. Whatever your challenge, our solutions deliver clarity and confidence.
          </p>
        </div>

        {/* Desktop grid (static cards) */}
        <div className="hidden md:grid grid-cols-3 gap-8 mt-12">
          {items.map((s, i) => (
            <div
              key={s.title}
              className="relative p-[1px] rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]"
            >
              <article
                className="
                  h-full rounded-[1rem] bg-white ring-1 ring-gray-100
                  shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)]
                  transition
                  flex flex-col
                "
                // If you want to remove even the hover shadow change, delete `hover:shadow[...]` and `transition` above.
              >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 min-h-[var(--card-hdr)]">
                  <div className="mb-2 flex items-center">
                    <span
                      className="
                        inline-flex items-center justify-center rounded-full px-2.5 py-1
                        text-[11px] font-semibold
                        bg-[#ef9601] text-white shadow-sm
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
                      <i aria-hidden className={`${s.icon} mt-[2px] text-[1.05rem] shrink-0 text-emerald-500`} />
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
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_8%,rgba(0,0,0,0.1),transparent_60%)]"
                  />
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

                {/* CTA + status line */}
                <div className="px-6 pt-3 mt-auto">
                  {s.href && (
                    <Link
                      href={s.href}
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:translate-y-[1px] transition"
                      aria-label={`Learn more about ${s.title}`}
                    >
                      {/* replace this section later with this: {i === 0 ? 'Explore the study' : i === 1 ? 'See integration options' : 'Start a custom brief'} */}
                      {i === 0 ? 'Contact us to learn more' : i === 1 ? 'Contact us to learn more' : 'Contact us to learn more'}
                    </Link>
                  )}
                  <div className="h-[var(--card-note)] flex items-center justify-center">
                    {s.statusNote ? (
                      <p className="mt-2 text-[11px] text-slate-500 text-center">{s.statusNote}</p>
                    ) : (
                      <span className="mt-2 text-[11px] opacity-0 select-none">placeholder</span>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Mobile stack (static cards) */}
        <div className="md:hidden mt-8 grid gap-6">
          {items.map((s, i) => (
            <div
              key={s.title}
              className="relative p-[1px] rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]"
            >
              <article className="rounded-[1rem] bg-white ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)] flex flex-col">
                {/* header */}
                <div className="px-5 pt-5 pb-3">
                  <div className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#ef9601] text-white shadow-sm">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">{s.title}</h3>
                  <div className="mt-1 flex items-start gap-2 text-sm text-emerald-600">
                    {s.icon ? <i aria-hidden className={`${s.icon} mt-[2px] text-base shrink-0 text-emerald-500`} /> : null}
                    <span>{s.kicker ?? '\u00A0'}</span>
                  </div>
                </div>

                <div className="relative mx-5 h-[180px] overflow-hidden rounded-xl ring-1 ring-gray-100">
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
                  <ExpandableText text={s.description} collapseHeight={140} />
                </div>

                <div className="px-5 pt-2 pb-1">
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

                <div className="px-5 pt-3 mt-auto">
                  {s.href && (
                    <Link
                      href={s.href}
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition active:translate-y-[1px]"
                      aria-label={`Learn more about ${s.title}`}
                    >
                      {/* replace this section later with this: {i === 0 ? 'Explore the study' : i === 1 ? 'See integration options' : 'Start a custom brief'} */}
                      {i === 0 ? 'Contact us to learn more' : i === 1 ? 'Contact us to learn more' : 'Contact us to learn more'} 
                    </Link>
                  )}
                  <div className="h-[var(--card-note)] flex items-center justify-center">
                    {s.statusNote ? (
                      <p className="mt-2 text-[11px] text-slate-500 text-center">{s.statusNote}</p>
                    ) : (
                      <span className="mt-2 text-[11px] opacity-0 select-none">placeholder</span>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}







