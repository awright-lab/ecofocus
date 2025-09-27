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

  // ---- THREE PILLARS (merged Syndicated Study + Dashboard) ----
  const fallback: Service[] = [
    {
      title: 'Syndicated Study + Interactive Dashboard',
      kicker: 'Annual study. Executive-ready insights. Delivered via dashboard.',
      description:
        "Our flagship, census-balanced study runs once per year—current fielding is complete. Teams license seat access to explore findings in the EcoFocus Interactive Dashboard with fast crosstabs, charts, and exports.",
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
        "By infusing our rich sustainability data into your existing research, we help you uncover actionable insights that guide product development and marketing strategies. Our data enriches your understanding of eco-conscious consumers—empowering you to connect with your target market in a meaningful way. With 13 years of syndicated research, a robust sample of 4,000 respondents, and a highly reliable margin of error of ~1.55%, we’ll integrate cleanly into your stack and strengthen your models.",
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

  // Filter remains if you pass your own services
  const items = (services ?? fallback).filter((s) => !/^\s*consulting\s*$/i.test(s.title));

  return (
    <section aria-labelledby="core-services-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:py-16">
        {/* Badge */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-black/60">Core Services</span>
        </div>

        {/* Heading */}
        <h3
          id="core-services-heading"
          className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
        >
          Three Pillars That Power Your Sustainability Advantage
        </h3>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          A modern, powerful stack: our annual syndicated study (delivered through an interactive dashboard), seamless data
          integration to enrich your models, and bespoke research for the questions only you can ask.
        </p>

        {/* Mobile carousel */}
        <MobileCarousel items={items} />

        {/* Desktop / Tablet grid — now 3 columns */}
        <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8 mt-8">
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
                /* Deep slate-blue gradient card */
                bg-gradient-to-br from-[#0F1A28] to-[#0B1320]
                ring-1 ring-white/10
                shadow-[0_12px_42px_-18px_rgba(3,10,20,0.55)]
                transition
                hover:-translate-y-0.5
                hover:shadow-[0_18px_64px_-20px_rgba(3,10,20,0.65)]
                grid grid-rows-[auto_176px_auto_1fr_auto]
              "
            >
              {/* subtle emerald edge + soft top highlight */}
              <span
                aria-hidden
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  bg-[radial-gradient(26rem_18rem_at_92%_-12%,rgba(16,185,129,.20),transparent_60%),linear-gradient(to_bottom,rgba(255,255,255,.06),transparent_28%)]
                  mix-blend-screen
                "
              />
              {/* thin inner ring */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10"
              />

              {/* 1) Title + Kicker */}
              <div className="relative p-5 pb-4">
                <h3
                  className="
                    text-xl md:text-2xl font-bold tracking-tight text-white leading-snug
                    line-clamp-2 min-h-[3.2rem] md:min-h-[4.0rem]
                  "
                >
                  {s.title}
                </h3>
                <div
                  className="
                    mt-1 flex items-start gap-2 text-sm text-emerald-300/90 leading-snug
                    line-clamp-2 min-h-[2.4rem]
                  "
                >
                  {s.icon ? <i aria-hidden className={`${s.icon} mt-[2px] text-base shrink-0`} /> : null}
                  <span>{s.kicker ?? '\u00A0'}</span>
                </div>
              </div>

              {/* 2) Image with soft inset + ring */}
              <div className="relative mx-5 h-[176px] overflow-hidden rounded-xl ring-1 ring-white/10">
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
                  <div className="h-full w-full bg-slate-800" />
                )}
                {/* top gloss */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,.10),transparent_38%)]"
                />
              </div>

              {/* 3) Description */}
              <div className="relative px-5 pt-4">
                <p className="text-[15px] text-slate-100/90 leading-relaxed line-clamp-5 min-h-[4.7rem]">
                  {s.description}
                </p>
              </div>

              {/* 4) Bullets */}
              <div className="relative px-5 pt-3 pb-1">
                {s.bullets && s.bullets.length > 0 ? (
                  <ul className="grid gap-1.5 min-h-[4.5rem]">
                    {s.bullets.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-slate-200/90">
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
                      text-slate-900 bg-emerald-300 hover:bg-emerald-200 transition
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

/* ================== Mobile Carousel (restyled to match cards) ================== */
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
      <div
        className="
          relative overflow-hidden rounded-xl
          bg-gradient-to-br from-[#0F1A28] to-[#0B1320]
          ring-1 ring-white/10
        "
        aria-roledescription="carousel"
      >
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
                {/* Title + Kicker */}
                <div className="p-4 pb-3">
                  <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 min-h-[3rem]">
                    {s.title}
                  </h3>
                  <div className="mt-1 flex items-start gap-2 text-sm text-emerald-300 leading-snug line-clamp-2 min-h-[2.4rem]">
                    {s.icon ? <i aria-hidden className={`${s.icon} mt-[2px] text-base shrink-0`} /> : null}
                    <span>{s.kicker ?? '\u00A0'}</span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-[160px] w-full overflow-hidden">
                  {s.image ? (
                    <Image src={s.image} alt={s.title} fill sizes="92vw" className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-slate-800" />
                  )}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,.10),transparent_38%)]"
                  />
                </div>

                {/* Description */}
                <div className="px-4 pt-3">
                  <p className="text-sm text-slate-100/90 leading-relaxed line-clamp-6 min-h-[5rem]">
                    {s.description}
                  </p>
                </div>

                {/* Bullets */}
                <div className="px-4 pt-2 pb-1">
                  {s.bullets && s.bullets.length > 0 ? (
                    <ul className="grid gap-1.5 min-h-[4.5rem]">
                      {s.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-slate-200">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ef9601]" />
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="min-h-[4.5rem]" />
                  )}
                </div>

                {/* CTA */}
                <div className="p-4 pt-3">
                  {s.href && (
                    <Link
                      href={s.href}
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-slate-900 bg-emerald-300 hover:bg-emerald-200 transition"
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
              className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-emerald-400' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

