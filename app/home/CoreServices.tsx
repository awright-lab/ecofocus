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

  const fallback: Service[] = [
    {
      title: 'Interactive Dashboard',
      kicker: '90k+ data points. Real-time crosstabs.',
      description:
        'Your instant library of 13+ years of sustainability data. Build charts and exports for client briefs, campaign pitches, and trend reports.',
      href: '/solutions/dashboard',
      image: '/images/solutions-dashboard.png',
      bullets: [
        'Seat licensing with onboarding',
        'Fast crosstabs, exports, charts',
        'Always-on access for your team',
      ],
      icon: 'ri-dashboard-3-line',
    },
    {
      title: 'Syndicated Study',
      kicker: 'Your questions. Executive-ready insights.',
      description:
        'Comprehensive, census-balanced, and ready to fuel client strategy. Add custom modules to answer client-specific questions.',
      href: '/solutions/syndicated',
      image: '/images/solutions-syndicated.png',
      bullets: [
        '4,000+ U.S. respondents (Gen Pop)',
        'Census-balanced; MoE ≈ ±1.55%',
        'Add your own questions/modules',
      ],
      icon: 'ri-bar-chart-2-line',
    },
    {
      title: 'Data Integration',
      kicker: 'Fuse datasets. Sharpen personas.',
      description:
        'Fuse EcoFocus with client datasets to sharpen personas, uncover shifts, and prove ROI on sustainability claims.',
      href: '/solutions/enhance-your-data',
      image: '/images/solutions-infusion.png',
      bullets: ['Raw files or secure data share', 'Schema mapping & QA support', 'Optional dashboard overlay'],
      icon: 'ri-database-2-line',
    },
    {
      title: 'Custom Studies',
      kicker: 'Answer your exact questions.',
      description:
        'When your clients face unique questions, our team designs fast, credible, and campaign-ready studies.',
      href: '/solutions/custom',
      image: '/images/solutions-custom.png',
      bullets: ['Quant & qual study design', 'Rapid polls & deep dives', 'Executive-ready storytelling'],
      icon: 'ri-flask-line',
    },
  ];

  const items = (services ?? fallback).filter((s) => !/^\s*consulting\s*$/i.test(s.title));

  return (
    <section aria-labelledby="core-services-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:py-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-black/60">Core Services</span>
        </div>

        <h3
          id="core-services-heading"
          className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
        >
          Solutions That Power Growth Across Every Industry
        </h3>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
        From dashboards to custom studies, EcoFocus helps brands and agencies translate sustainability attitudes into strategies that work. Whatever your challenge, our solutions deliver clarity and confidence.
        </p>

        {/* Mobile carousel */}
        <MobileCarousel items={items} />

        {/* Desktop / Tablet grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8 mt-8">
          {items.map((s, i) => (
            <motion.article
            key={s.title}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="
              group relative h-full overflow-hidden
              rounded-2xl
              bg-gradient-to-br from-white to-gray-50
              ring-1 ring-black/5
              shadow-[0_14px_48px_-18px_rgba(2,12,27,.22)]
              transition
              hover:-translate-y-0.5
              hover:shadow-[0_22px_72px_-22px_rgba(2,12,27,.32)]
              grid grid-rows-[auto_176px_auto_1fr_auto]
            "
          >
            {/* subtle emerald glow + soft top highlight */}
            <span
              aria-hidden
              className="
                pointer-events-none absolute inset-0 rounded-2xl
                bg-[radial-gradient(26rem_18rem_at_90%_-10%,rgba(16,185,129,.16),transparent_60%),linear-gradient(to_bottom,rgba(255,255,255,.65),transparent 28%)]
              "
            />
            {/* thin inner ring like the mock */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/70"
            />
          
            {/* 1) Title + Kicker */}
            <div className="relative p-5 pb-4">
              <h3
                className="
                  text-xl md:text-2xl font-bold tracking-tight text-gray-900 leading-snug
                  line-clamp-2 min-h-[3.2rem] md:min-h-[4.0rem]
                "
              >
                {s.title}
              </h3>
              <div
                className="
                  mt-1 flex items-start gap-2 text-sm text-emerald-700/90 leading-snug
                  line-clamp-2 min-h-[2.4rem]
                "
              >
                {s.icon ? <i aria-hidden className={`${s.icon} mt-[2px] text-base shrink-0`} /> : null}
                <span>{s.kicker ?? '\u00A0'}</span>
              </div>
            </div>
          
            {/* 2) Image with soft inset + ring */}
            <div className="relative mx-5 h-[176px] overflow-hidden rounded-xl ring-1 ring-black/5">
              {s.image ? (
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width:1280px)20vw,(min-width:1024px)24vw,(min-width:768px)33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  priority={i < 2}
                />
              ) : (
                <div className="h-full w-full bg-emerald-50" />
              )}
              {/* top gloss */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,.45),transparent_38%)]"
              />
            </div>
          
            {/* 3) Description */}
            <div className="relative px-5 pt-4">
              <p className="text-[15px] text-gray-800 leading-relaxed line-clamp-3 min-h-[3.6rem]">
                {s.description}
              </p>
            </div>
          
            {/* 4) Bullets */}
            <div className="relative px-5 pt-3 pb-1">
              {s.bullets && s.bullets.length > 0 ? (
                <ul className="grid gap-1.5 min-h-[4.5rem]">
                  {s.bullets.slice(0, 3).map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-gray-700">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ef9601]" />
                      <span className="line-clamp-1">{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="min-h-[4.5rem]" />
              )}
            </div>
          
            {/* 5) CTA */}
            <div className="relative p-5 pt-3">
              {s.href && (
                <Link
                  href={s.href}
                  className="
                    inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                    text-white bg-emerald-600 hover:bg-emerald-700 transition
                    shadow-[inset_0_-2px_0_0_rgba(0,0,0,.06)]
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

/* ================== Mobile Carousel (same row skeleton) ================== */
function MobileCarousel({ items }: { items: Service[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const count = items.length;

  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const startX = React.useRef<number | null>(null);
  const deltaX = React.useRef(0);

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(count - 1, i)));
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    trackRef.current.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    deltaX.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null || !trackRef.current) return;
    deltaX.current = e.clientX - startX.current;
    trackRef.current.style.transition = 'none';
    trackRef.current.style.transform = `translateX(calc(${-index * 100}% + ${deltaX.current}px))`;
  };

  const endDrag = () => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = reduceMotion ? 'none' : 'transform 300ms ease';
    trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    startX.current = null;
    deltaX.current = 0;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || startX.current === null) return;
    try { trackRef.current.releasePointerCapture(e.pointerId); } catch {}
    const threshold = 50;
    if (deltaX.current > threshold) prev();
    else if (deltaX.current < -threshold) next();
    endDrag();
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try { trackRef.current?.releasePointerCapture(e.pointerId); } catch {}
    endDrag();
  };

  React.useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = reduceMotion ? 'none' : 'transform 300ms ease';
    trackRef.current.style.transform = `translateX(-${index * 100}%)`;
  }, [index, reduceMotion]);

  if (count === 0) return null;

  return (
    <div className="md:hidden mt-6" role="region" aria-label="Core services carousel">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white" aria-roledescription="carousel">
        <div
          ref={trackRef}
          className="flex touch-pan-y select-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          {items.map((s, i) => (
            <div
              key={s.title}
              className="w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${count}: ${s.title}`}
            >
              <article className="grid grid-rows-[auto_160px_auto_1fr_auto] h-full">
                {/* Title + Kicker (reserve for 2 lines each) */}
                <div className="p-4 pb-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 min-h-[3rem]">
                    {s.title}
                  </h3>
                  <div className="mt-1 flex items-start gap-2 text-sm text-emerald-700 leading-snug line-clamp-2 min-h-[2.4rem]">
                    {s.icon ? <i aria-hidden className={`${s.icon} mt-[2px] text-base shrink-0`} /> : null}
                    <span>{s.kicker ?? '\u00A0'}</span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-[160px] w-full overflow-hidden">
                  {s.image ? (
                    <Image src={s.image} alt={s.title} fill sizes="92vw" className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-emerald-50" />
                  )}
                </div>

                {/* Description */}
                <div className="px-4 pt-3">
                  <p className="text-sm text-gray-800 leading-relaxed line-clamp-3 min-h-[3.4rem]">
                    {s.description}
                  </p>
                </div>

                {/* Bullets */}
                <div className="px-4 pt-2 pb-1">
                  {s.bullets && s.bullets.length > 0 ? (
                    <ul className="grid gap-1.5 min-h-[4.5rem]">
                      {s.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-gray-700">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ef9601]" />
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="min-h-[4.5rem]" />
                  )}
                </div>

                {/* CTA (more top space) */}
                <div className="p-4 pt-3">
                  {s.href && (
                    <Link
                      href={s.href}
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
                      aria-label={`Learn more about ${s.title}`}
                    >
                      Learn more
                    </Link>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Prev / Next */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            className="pointer-events-auto flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow ring-1 ring-gray-200 h-8 w-8 disabled:opacity-40"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index === count - 1}
            className="pointer-events-auto flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow ring-1 ring-gray-200 h-8 w-8 disabled:opacity-40"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Slides">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-emerald-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
