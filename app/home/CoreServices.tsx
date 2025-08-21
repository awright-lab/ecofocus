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
  image?: string;       // image URL/path
  bullets?: string[];   // optional list
};

interface Props {
  services?: Service[];
}

export default function CoreServices({ services }: Props) {
  const reduceMotion = useReducedMotion();

  const fallback: Service[] = [
    {
      title: 'Syndicated Research',
      description: 'Annual EcoFocus study with 4,000+ respondents and 13 years of trends.',
      href: '/services/syndicated',
      icon: 'ri-bar-chart-2-line',
      image: '/images/services/syndicated.jpg',
    },
    {
      title: 'Custom Research',
      description: 'Audience-specific surveys, concept tests, and packaging claims validation.',
      href: '/services/custom',
      icon: 'ri-flask-line',
      image: '/images/services/custom.jpg',
    },
    {
      title: 'Dashboard Access',
      description: 'Self-serve, real-time cross tabs and charts across 90k+ data points.',
      href: '/dashboard',
      icon: 'ri-dashboard-3-line',
      image: '/images/services/dashboard.jpg',
    },
    // Consulting intentionally omitted
  ];

  // Filter out any item titled exactly "Consulting" (case-insensitive)
  const items = (services ?? fallback).filter(s => !/^\s*consulting\s*$/i.test(s.title));

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

        <h2 id="core-services-heading" className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)]">
          Solutions
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Choose the path that fits your goals—then scale from insights to action.
        </p>

        {/* ======= MOBILE: Carousel / Slideshow (md:hidden) ======= */}
        <MobileCarousel items={items} />

        {/* ======= DESKTOP/TABLET: grid with IMAGE AS TOP HALF ======= */}
        <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8 mt-8">
          {items.map((s, i) => (
            <motion.article
              key={s.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="
                group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm
                transition hover:border-emerald-300 hover:shadow-md
                grid grid-rows-[1fr_1fr] h-[460px]
              "
            >
              {/* Top half = image */}
              <div className="relative overflow-hidden">
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-emerald-50" />
                )}
              </div>

              {/* Bottom half = body */}
              <div className="p-5 flex flex-col">
                <div className="flex items-start gap-3">
                  {s.icon ? (
                    <i aria-hidden="true" className={`${s.icon} text-3xl text-emerald-600`} />
                  ) : (
                    <span className="mt-1 h-6 w-6 rounded-md bg-emerald-600" aria-hidden="true" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                </div>

                <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                  {s.description}
                </p>

                {/* Optional bullets — keep compact to avoid overflow */}
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {s.bullets.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-gray-700">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#ef9601]" />
                        <span className="line-clamp-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.href && (
                  <Link
                    href={s.href}
                    className="mt-auto inline-block text-sm font-semibold text-emerald-700"
                    aria-label={`Learn more about ${s.title}`}
                  >
                    Learn more →
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

/* ================== Inline Mobile Carousel ================== */

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

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || startX.current === null) return;

    try { trackRef.current.releasePointerCapture(e.pointerId); } catch {}

    const threshold = 50;
    if (deltaX.current > threshold) prev();
    else if (deltaX.current < -threshold) next();

    trackRef.current.style.transition = reduceMotion ? 'none' : 'transform 300ms ease';
    trackRef.current.style.transform = `translateX(-${index * 100}%)`;

    startX.current = null;
    deltaX.current = 0;
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    try { trackRef.current.releasePointerCapture(e.pointerId); } catch {}
    trackRef.current.style.transition = reduceMotion ? 'none' : 'transform 300ms ease';
    trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    startX.current = null;
    deltaX.current = 0;
  };

  React.useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = reduceMotion ? 'none' : 'transform 300ms ease';
    trackRef.current.style.transform = `translateX(-${index * 100}%)`;
  }, [index, reduceMotion]);

  if (count === 0) return null;

  return (
    <div className="md:hidden mt-6" role="region" aria-label="Core services carousel">
      {/* Viewport */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white" aria-roledescription="carousel">
        {/* Track */}
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
              <article className="overflow-hidden">
                {/* Image as top section */}
                {s.image && (
                  <div className="relative aspect-[16/9]">
                    <Image src={s.image} alt={s.title} fill sizes="92vw" className="object-cover" />
                  </div>
                )}

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {s.icon ? (
                      <i aria-hidden="true" className={`${s.icon} text-2xl text-emerald-600`} />
                    ) : (
                      <span className="h-5 w-5 rounded-md bg-emerald-600" aria-hidden="true" />
                    )}
                    <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 line-clamp-3">{s.description}</p>

                  {s.href && (
                    <Link href={s.href} className="mt-4 inline-block text-sm font-semibold text-emerald-700" aria-label={`Learn more about ${s.title}`}>
                      Learn more →
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
  );
}





















