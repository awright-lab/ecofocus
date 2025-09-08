// app/reports/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import StoreHero from './StoreHero';
import {
  BarChart2,
  Users,
  TrendingUp,
  LayoutDashboard,
  HelpCircle,
  ArrowRight,
  Tag,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import * as React from 'react';

import { SMALL_REPORTS } from '@/lib/catalog';

/* ——— Topics (unchanged) ——— */
const PAID_TOPICS = ['Packaging', 'Claims & Messaging', 'Consumer Segments', 'Retail & Channel', 'Category Deep Dives'];
const FREE_TOPICS = ['The Green Mindset', 'Packaging in the Spotlight', 'Trust & Accountability', 'The Recycling Reality', 'The Price of Green', 'Knowledge is Power'];

/* Slides */
type Slide = { title: string; image: string; href: string };

const toSlides = (list: typeof SMALL_REPORTS): Slide[] =>
  list.map((p) => ({ title: p.title, image: p.img, href: `/store/${p.id}` }));

const byYearDesc = (a: (typeof SMALL_REPORTS)[number], b: (typeof SMALL_REPORTS)[number]) => b.year - a.year;

const PAID_SLIDES: Slide[] = toSlides(
  [...SMALL_REPORTS].filter((p) => p.accessModel === 'paid-direct' || p.accessModel === 'paid-contact').sort(byYearDesc).slice(0, 8)
);
const FREE_SLIDES: Slide[] = toSlides(
  [...SMALL_REPORTS].filter((p) => p.accessModel === 'free-gated' || p.accessModel === 'free-open').sort(byYearDesc).slice(0, 8)
);

export default function ReportsForkPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports' }]} />
      <StoreHero />

      {/* Stats strip */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat icon={<Users className="h-5 w-5" />} title="4,000+ respondents" desc="National sample each wave" />
            <Stat icon={<TrendingUp className="h-5 w-5" />} title="13 years of trends" desc="Comparable KPIs and cohorts" />
            <Stat icon={<BarChart2 className="h-5 w-5" />} title="90k+ data points" desc="Cross-tabs & ready-to-use charts" />
          </div>
        </div>
      </section>

      {/* Which should I choose? */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-black/60">Guide</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Which reports are right for me?</h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Paid and Free serve different needs. Use this quick guide to jump to the best fit.
          </p>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <ChoiceCard
              eyebrow="Paid reports"
              title="Decision-ready depth"
              bullets={[
                'Latest wave analysis',
                'Focused slices and flagship report',
                'Licensing for internal use',
                'Buy direct or contact our team',
              ]}
              href="/reports/paid"
              cta="Explore paid"
              slides={PAID_SLIDES}
            />
            <ChoiceCard
              eyebrow="Free reports"
              title="Complimentary downloads"
              bullets={[
                'Previous-wave highlights',
                'Topic slices and full report',
                'Email-gated delivery',
                'Great for orientation & testing',
              ]}
              href="/reports/free"
              cta="Browse free"
              slides={FREE_SLIDES}
            />
          </div>
        </div>
      </section>

      {/* Topics quick links (unchanged) */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-4">
          <div className="rounded-2xl border bg-gradient-to-b from-emerald-50 to-white p-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-emerald-700" />
              <h3 className="text-lg font-semibold text-gray-900">Explore by topic</h3>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-semibold text-emerald-800/80">Paid reports</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PAID_TOPICS.map((t) => (
                    <Link
                      key={t}
                      href={`/reports/paid?topic=${encodeURIComponent(t)}`}
                      className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-emerald-800/80">Free reports</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FREE_TOPICS.map((t) => (
                    <Link
                      key={t}
                      href={`/reports/free?topic=${encodeURIComponent(t)}`}
                      className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/solutions/syndicated-study-2025"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Syndicated Study Buy-In <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/solutions/data-enrichment"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Enhance Your Data <Database className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard promo + FAQ (unchanged) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-blue-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border bg-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-emerald-700" />
              <h3 className="text-xl font-semibold text-gray-900">Prefer it interactive?</h3>
            </div>
            <p className="text-sm text-gray-700 md:ml-auto md:max-w-xl">
              License seats to our DisplayR-powered dashboard for self-serve crosstabs and charts across 90k+ data points.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Explore the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-black/60">FAQ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Common questions</h2>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <FAQ
              q="What’s the difference between Paid and Free?"
              a="Paid reports include the latest wave with deeper analysis and licensing for internal use. Free reports include complimentary downloads from the previous wave, email-gated."
            />
            <FAQ
              q="Can I get the raw data?"
              a="Yes — our Enhance Your Data service blends EcoFocus data with your datasets and provides matched crosstabs and governance guidance."
            />
            <FAQ
              q="Do Paid reports include dashboard access?"
              a="Paid programs can include dashboard seats; the number of seats scales by organization size. We’ll align during discovery."
            />
            <FAQ
              q="How is licensing handled?"
              a="Paid content includes a standard internal-use license. We can scope broader usage if needed."
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ===== Small presentational helpers ===== */

function Stat({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700">{icon}</div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-600">{desc}</div>
      </div>
    </div>
  );
}

/* ===== Carousel handle so parent can control it ===== */
type CarouselHandle = { next: () => void; prev: () => void; goTo: (i: number) => void };

/* ======================= UPDATED CARD ======================= */
function ChoiceCard({
  eyebrow,
  title,
  bullets,
  href,
  cta,
  slides = [],
}: {
  eyebrow: string;
  title: string;
  bullets: string[];
  href: string;
  cta: string;
  slides?: Slide[];
}) {
  const carRef = React.useRef<CarouselHandle>(null);

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm transition">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Copy */}
        <div className="p-6 flex flex-col">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-black/60">{eyebrow}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-gray-900">{title}</h3>
          <ul className="mt-3 space-y-1.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link
            href={href}
            className="mt-5 inline-flex w-max items-center gap-1 rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            {cta} <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Moved arrows here (bottom-left of copy column) */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => carRef.current?.prev()}
              aria-label="Previous"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => carRef.current?.next()}
              aria-label="Next"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel — divider removed */}
        <div>
          <MiniCarousel ref={carRef} items={slides} auto interval={4000} />
        </div>
      </div>
    </div>
  );
}

/* ==================== Mini Carousel ==================== */
const MiniCarousel = React.forwardRef<CarouselHandle, { items: Slide[]; auto?: boolean; interval?: number }>(
  ({ items, auto = true, interval = 4000 }, ref) => {
    const [index, setIndex] = React.useState(0);
    const trackRef = React.useRef<HTMLDivElement | null>(null);
    const viewportRef = React.useRef<HTMLDivElement | null>(null);
    const count = items.length;

    const goTo = React.useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
    const next = React.useCallback(() => setIndex((i) => (i + 1) % count), [count]);
    const prev = React.useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

    React.useImperativeHandle(ref, () => ({ next, prev, goTo }), [next, prev, goTo]);

    // drag/swipe
    const startX = React.useRef<number | null>(null);
    const deltaX = React.useRef<number>(0);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      startX.current = e.clientX;
      deltaX.current = 0;
      trackRef.current?.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (startX.current === null || !trackRef.current) return;
      deltaX.current = e.clientX - startX.current;
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(calc(${-index * 100}% + ${deltaX.current}px))`;
    };
    const settle = () => {
      if (!trackRef.current) return;
      trackRef.current.style.transition = 'transform 320ms ease';
      trackRef.current.style.transform = `translateX(-${index * 100}%)`;
      startX.current = null;
      deltaX.current = 0;
    };
    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      try { trackRef.current?.releasePointerCapture(e.pointerId); } catch {}
      if (Math.abs(deltaX.current) > 50) {
        if (deltaX.current < 0) next(); else prev();
      }
      settle();
    };
    const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
      try { trackRef.current?.releasePointerCapture(e.pointerId); } catch {}
      settle();
    };

    // auto-rotate (pause on hover/focus)
    const [paused, setPaused] = React.useState(false);
    React.useEffect(() => {
      if (!auto || paused || count <= 1) return;
      const id = window.setInterval(next, interval);
      return () => window.clearInterval(id);
    }, [auto, paused, count, interval, next]);

    React.useEffect(() => {
      if (!trackRef.current) return;
      trackRef.current.style.transition = 'transform 320ms ease';
      trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    }, [index]);

    if (!count) {
      return (
        <div className="flex h-full items-center justify-center p-6 text-sm text-gray-500">
          No previews yet.
        </div>
      );
    }

    return (
      <div
        className="relative h-full p-4"
        role="region"
        aria-label="Report previews"
        ref={viewportRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* viewport (no hover effect) */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white" aria-roledescription="carousel">
          {/* track */}
          <div
            ref={trackRef}
            className="flex select-none touch-pan-y"
            style={{ transform: `translateX(-${index * 100}%)` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            {items.map((s) => (
              <div key={s.href} className="w-full shrink-0">
                <Link href={s.href} className="block relative">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width: 768px) 40vw, 90vw"
                      className="object-cover" // <— no group-hover ring or overlay
                    />
                  </div>
                  <div className="p-3">
                    <div className="line-clamp-2 text-sm font-semibold text-gray-900">{s.title}</div>
                    <div className="mt-0.5 text-xs text-emerald-700">View report</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* dots (kept) */}
        <div className="mt-3 flex items-center justify-end gap-1.5" role="tablist" aria-label="Slides">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-emerald-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    );
  }
);
MiniCarousel.displayName = 'MiniCarousel';

/* ========================= FAQ ========================= */
function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-gray-200 bg-white p-4 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-emerald-700" />
          <span className="text-sm font-semibold text-gray-900">{q}</span>
        </div>
        <span className="text-gray-500 text-xs">Expand</span>
      </summary>
      <p className="mt-3 text-sm text-gray-700">{a}</p>
    </details>
  );
}



















