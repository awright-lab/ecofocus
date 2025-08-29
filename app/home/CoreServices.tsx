// app/home/CoreServices.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type Service = {
  title: string;
  /** Short secondary line under the title (6–10 words) */
  kicker?: string;
  /** One-sentence description */
  description: string;
  href?: string;
  image?: string;
  bullets?: string[];
  /** Optional icon class (e.g., remixicon), used next to kicker */
  icon?: string;
};

interface Props {
  services?: Service[];
}

export default function CoreServices({ services }: Props) {
  const reduceMotion = useReducedMotion();

  // Default content (edit freely)
  const fallback: Service[] = [
    {
      title: 'Dashboard Access',
      kicker: 'Instant crosstabs. 90k+ data points.',
      description:
        'Self-serve, real-time crosstabs and charts across 90k+ data points with 13 years of trends.',
      href: '/dashboard',
      image: '/images/solutions-dashboard.png',
      bullets: [
        'Seat licensing with onboarding',
        'Fast crosstabs, exports, charts',
        'Always-on access for your team',
      ],
      icon: 'ri-dashboard-3-line',
    },
    {
      title: 'Syndicated Study Buy-In (2025)',
      kicker: 'Add your questions. Executive-grade outputs.',
      description:
        'Join the 2025 EcoFocus wave and add proprietary questions. Deliverables include dashboard access, crosstabs, and executive reporting.',
      href: '/solutions/syndicated-buy-in',
      image: '/images/solutions-syndicated.png',
      bullets: [
        '4,000+ U.S. respondents (Gen Pop)',
        'Census-balanced; MoE ≈ ±1.55%',
        'Add your own questions/modules',
      ],
      icon: 'ri-bar-chart-2-line',
    },
    {
      title: 'Enhance Your Data (Data Lake Integration)',
      kicker: 'Fuse datasets. Sharpen personas.',
      description:
        'Blend our validated 2024 dataset with your internal data for richer personas, better forecasting, and unified analytics.',
      href: '/solutions/enhance-your-data',
      image: '/images/solutions-enhance.png',
      bullets: ['Raw files or secure data share', 'Schema mapping & QA support', 'Optional dashboard overlay'],
      icon: 'ri-database-2-line',
    },
    {
      title: 'Custom Research',
      kicker: 'Answer the exact question.',
      description:
        'Audience-specific surveys, concept tests, and packaging/claims validation—designed to answer your exact questions.',
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
        {/* Eyebrow */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-black/60">Core Services</span>
        </motion.div>

        <h2
          id="core-services-heading"
          className="font-extrabold leading-tight text-gray-900 text-[clamp(1.9rem,5vw,2.75rem)]"
        >
          Solutions
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Choose the path that fits your goals—then scale from insights to action.
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
                group relative flex h-full flex-col overflow-hidden
                rounded-xl border border-gray-200 bg-white shadow-sm
                transition hover:border-emerald-300 hover:shadow-md
              "
            >
              {/* Title + Kicker */}
              <div className="p-5">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">{s.title}</h3>
                {s.kicker && (
                  <div className="mt-1 flex items-center gap-2 text-sm text-emerald-700">
                    {s.icon ? <i aria-hidden className={`${s.icon} text-base`} /> : null}
                    <span className="font-medium">{s.kicker}</span>
                  </div>
                )}
              </div>

              {/* Image (consistent height to align cards) */}
              <div className="relative h-44 w-full overflow-hidden">
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 24vw, (min-width: 768px) 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    priority={i < 2}
                  />
                ) : (
                  <div className="h-full w-full bg-emerald-50" />
                )}
              </div>

              {/* Description + Bullets + CTA */}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[15px] text-gray-800">{s.description}</p>

                {s.bullets && s.bullets.length > 0 && (
                  // fixed min-height so bullets area lines up across cards
                  <ul className="mt-3 grid gap-1.5 min-h-[84px]">
                    {s.bullets.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-gray-700">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ef9601]" />
                        <span className="line-clamp-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.href && (
                  <Link
                    href={s.href}
                    className="
                      mt-auto inline-flex items-center justify-center rounded-full px-4 py-2
                      text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700
                      transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600
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

/* =============== Mobile Carousel (stacked layout) =============== */
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
              <article className="flex h-full flex-col overflow-hidden">
                {/* Title + Kicker */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                  {s.kicker && (
                    <div className="mt-1 flex items-center gap-2 text-sm text-emerald-700">
                      {s.icon ? <i aria-hidden className={`${s.icon} text-base`} /> : null}
                      <span className="font-medium">{s.kicker}</span>
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {s.image ? (
                    <Image src={s.image} alt={s.title} fill sizes="92vw" className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-emerald-50" />
                  )}
                </div>

                {/* Description + Bullets + CTA */}
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-sm text-gray-800">{s.description}</p>

                  {s.bullets && s.bullets.length > 0 && (
                    <ul className="mt-3 grid gap-1.5 min-h-[84px]">
                      {s.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-gray-700">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ef9601]" />
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.href && (
                    <Link
                      href={s.href}
                      className="mt-auto inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
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