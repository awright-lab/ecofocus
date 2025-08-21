// app/components/CoreServices.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type Service = {
  title: string;
  description: string;
  href?: string;
  icon?: string;        // remix icon class (optional)
  image?: string;       // optional, if you show an image on cards
  bullets?: string[];   // optional list
};

interface Props {
  services?: Service[]; // if you already fetch from CMS, pass them in
}

export default function CoreServices({ services }: Props) {
  const reduceMotion = useReducedMotion();

  // If you pass services from CMS, we’ll use those; otherwise a sensible fallback.
  const fallback: Service[] = [
    { title: 'Syndicated Research', description: 'Annual EcoFocus study with 4,000+ respondents and 13 years of trends.', href: '/services/syndicated', icon: 'ri-bar-chart-2-line' },
    { title: 'Custom Research', description: 'Audience-specific surveys, concept tests, and packaging claims validation.', href: '/services/custom', icon: 'ri-flask-line' },
    { title: 'Dashboard Access', description: 'Self-serve, real-time cross tabs and charts across 90k+ data points.', href: '/dashboard', icon: 'ri-dashboard-3-line' },
    // { title: 'Consulting', ... }  <-- deliberately omitted
  ];

  // 🚫 Remove any item named “Consulting” (case-insensitive)
  const items = (services ?? fallback).filter(s => !/^\s*consulting\s*$/i.test(s.title));

  // Inline collapsible (used only on mobile cards to hide long bullet lists)
  function CollapsibleList({ items, initial = 2 }: { items: string[]; initial?: number }) {
    const [open, setOpen] = React.useState(false);
    const visible = open ? items : items.slice(0, initial);
    return (
      <div>
        <ul className="mt-3 space-y-2">
          {visible.map((t) => (
            <li key={t} className="flex gap-2 text-sm text-gray-700">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#ef9601]" />
              <span className="line-clamp-2">{t}</span>
            </li>
          ))}
        </ul>
        {items.length > initial && (
          <button
            onClick={() => setOpen(v => !v)}
            className="mt-2 text-sm font-medium text-emerald-700 underline"
          >
            {open ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  }

  return (
    <section aria-labelledby="core-services-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:py-16">
        {/* Eyebrow + Heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-xs sm:text-sm"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-gray-700">Core Services</span>
        </motion.div>

        <h2
          id="core-services-heading"
          className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)]"
        >
          What we deliver
        </h2>

        {/* MOBILE: horizontal snap scroller (md:hidden) */}
        <div className="md:hidden -mx-4 px-4 mt-6 overflow-x-auto" role="region" aria-label="Core services">
          <ul className="flex snap-x snap-mandatory gap-4" role="list">
            {items.map((s, i) => (
              <li key={s.title} className="min-w-[84%] snap-start">
                <motion.article
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {s.icon ? (
                      <i aria-hidden="true" className={`${s.icon} text-2xl text-emerald-600`} />
                    ) : (
                      <span className="h-5 w-5 rounded-md bg-emerald-600" aria-hidden="true" />
                    )}
                    <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
                  </div>

                  <p className="mt-2 text-sm text-gray-700 line-clamp-3">{s.description}</p>

                  {s.bullets && s.bullets.length > 0 && (
                    <CollapsibleList items={s.bullets} initial={2} />
                  )}

                  {s.href && (
                    <Link
                      href={s.href}
                      className="mt-4 inline-block text-sm font-semibold text-emerald-700"
                      aria-label={`Learn more about ${s.title}`}
                    >
                      Learn more →
                    </Link>
                  )}
                </motion.article>
              </li>
            ))}
          </ul>
        </div>

        {/* DESKTOP/TABLET: your regular grid (unchanged visual style) */}
        <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8 mt-8">
          {items.map((s, i) => (
            <motion.article
              key={s.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                {s.icon ? (
                  <i aria-hidden="true" className={`${s.icon} text-3xl text-emerald-600`} />
                ) : (
                  <span className="mt-1 h-6 w-6 rounded-md bg-emerald-600" aria-hidden="true" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{s.description}</p>
                </div>
              </div>

              {s.image && (
                <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-lg">
                  <Image src={s.image} alt="" fill sizes="(min-width: 768px) 33vw, 90vw" className="object-cover" />
                </div>
              )}

              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-gray-700">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#ef9601]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {s.href && (
                <Link
                  href={s.href}
                  className="mt-5 inline-block text-sm font-semibold text-emerald-700"
                  aria-label={`Learn more about ${s.title}`}
                >
                  Learn more →
                </Link>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}


















