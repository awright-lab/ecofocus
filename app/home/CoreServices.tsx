// components/sections/SolutionsSection.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

type Card = {
  title: string;
  image: { src: string; alt: string; objectPosition?: string }; // supports focal point
  bullets: string[];
  cta: { label: string; href: string; external?: boolean };
  footnote?: React.ReactNode;
};

const CARDS: Card[] = [
  {
    title: 'Syndicated Research',
    image: { src: '/images/solutions/syndicated.png', alt: 'Analyst reviewing sustainability dashboards', objectPosition: '50% 35%' },
    bullets: [
      'Annual U.S. study (n=4,000), Census-balanced',
      'Trends since 2010 across attitudes & behaviors',
      'Interactive dashboard with instant crosstabs',
    ],
    cta: { label: 'Learn More', href: '/solutions/syndicated', external: true },
  },
  {
    title: 'Custom Research',
    image: { src: '/images/solutions/custom.png', alt: 'Workshop with stakeholder sticky notes' },
    bullets: [
      'B2C & B2B: qual + quant',
      'Questionnaire, sample & analysis',
      'Executive summary & workshop',
    ],
    cta: { label: 'Learn More', href: '/solutions' },
  },
  {
    title: 'Data Infusion',
    image: { src: '/images/solutions/datainfusion.png', alt: 'Data visualization showing customer segments', objectPosition: '50% 45%' },
    bullets: [
      'Enrich your data with EcoFocus context',
      'Personas with a sustainability lens',
      'Frictionless BI integration',
    ],
    cta: { label: 'Learn More', href: '/solutions' },
  },
  {
    title: 'Consulting & Enablement',
    image: { src: '/images/solutions/consulting.png', alt: 'Team collaboration for strategy activation' },
    bullets: [
      'Strategy activation & change management',
      'Team enablement, training & adoption',
      'Program rollouts / PMO support',
    ],
    cta: { label: 'Learn More', href: '/solutions', external: true },
    footnote: (
      <span className="text-xs text-slate-500">
        Delivered with our consulting partner{' '}
        <a className="underline hover:text-slate-700" href="https://fwdfocus.com/" target="_blank" rel="noopener noreferrer">
          ForwardFocus
        </a>.
      </span>
    ),
  },
];

export default function SolutionsSection() {
  return (
    <section aria-labelledby="solutions-heading" className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 md:mb-8">
          <h2 id="solutions-heading" className="font-semibold leading-tight text-[clamp(1.4rem,3vw,2rem)]">
            Solutions
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Choose the path that fits your goals—then scale from insights to action.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 95vw"
                  className="object-cover"
                  style={card.image.objectPosition ? { objectPosition: card.image.objectPosition } : undefined}
                  priority={false}
                />
                {/* subtle gradient for legibility if you overlay labels later */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent opacity-90" />
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="text-base font-semibold md:text-lg">{card.title}</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                  {card.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between">
                  {card.cta.external ? (
                    <a
                      href={card.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                      aria-label={`${card.title}: ${card.cta.label}`}
                    >
                      {card.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={card.cta.href}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                      aria-label={`${card.title}: ${card.cta.label}`}
                    >
                      {card.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                {card.footnote ? <div className="mt-3">{card.footnote}</div> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}














