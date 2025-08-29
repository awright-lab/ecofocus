// app/reports/paid/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

import { CATALOG } from '@/lib/catalog';             // or '@/lib/catalog' in your project
import { toReportCardModel, isSmallReport, isSirBundle } from '@/lib/productUtils';
import type { ReportCardModel } from '@/types/reportModels';

import { LayoutGrid, List, ArrowRight } from 'lucide-react';
import PaidHero from './PaidHero';

export default function PaidReportsPage() {
  const models: ReportCardModel[] = React.useMemo(() => {
    return CATALOG
      .filter((p) => isSmallReport(p) || isSirBundle(p))
      .map(toReportCardModel)
      .filter((m) => m.badge === 'Paid');
  }, []);

  // View state
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [visible, setVisible] = React.useState(9); // start modest for mobile

  const shown = models.slice(0, visible);

  const loadMore = () => {
    setVisible((v) => v + (view === 'grid' ? 9 : 15));
  };

  return (
    <>
      <Header />
      <PaidHero />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports', href: '/reports' }, { label: 'Paid' }]} />

      {/* Hero (catchy + year-agnostic) */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-blue-900/80" />
        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <h1 className="text-3xl md:text-4xl font-bold">Decision-Ready Reports</h1>
          <p className="mt-2 text-emerald-100 max-w-2xl">
            Focused analyses and flagship deliverables designed to move decisions forward.
          </p>

          {/* Controls */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/reports/free"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Prefer complimentary downloads? <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="ml-auto inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/20">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${
                  view === 'grid' ? 'bg-white text-emerald-800' : 'text-white hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="h-4 w-4" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${
                  view === 'list' ? 'bg-white text-emerald-800' : 'text-white hover:bg-white/10'
                }`}
              >
                <List className="h-4 w-4" /> Compact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="bg-white">
        <section className="mx-auto max-w-7xl px-6 py-10">
          {/* Grid view */}
          {view === 'grid' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((r) => (
                <PaidReportCard key={r.id} r={r} />
              ))}
            </div>
          )}

          {/* List view (mobile-friendly, denser) */}
          {view === 'list' && (
            <div className="divide-y divide-gray-200 rounded-xl border">
              {shown.map((r) => (
                <PaidReportRow key={r.id} r={r} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {models.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
              Paid reports coming soon.
            </div>
          )}

          {/* Load more */}
          {visible < models.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                className="inline-flex items-center rounded-full border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Load more
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ================== Cards that align perfectly ================== */

function PaidReportCard({ r }: { r: ReportCardModel }) {
  const cover = r.cover || '/images/report-cover-fallback.jpg';
  const price =
    typeof r.price === 'number' ? `$${r.price.toLocaleString()}` : undefined;

  // Decide CTA based on purchaseType
  const isContact = r.purchaseType === 'contact';
  const href = r.href ?? `/contact?topic=report&id=${encodeURIComponent(r.id)}&year=${r.year}`;

  return (
    <article
      className="
        group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-300 transition
        grid grid-rows-[auto_1fr_auto] h-full overflow-hidden
      "
    >
      {/* Media */}
      <div className="relative aspect-[16/9]">
        <Image src={cover} alt={r.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
      </div>

      {/* Body (locks title/excerpt area so CTAs align) */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
          {r.title}
        </h3>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3 min-h-[3.5rem]">
          {r.excerpt}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          {r.topic && <span className="rounded-full bg-gray-100 px-2 py-0.5">{r.topic}</span>}
          {r.category && <span className="rounded-full bg-gray-100 px-2 py-0.5">{r.category}</span>}
          <span className="ml-auto">{r.year}</span>
        </div>
      </div>

      {/* CTA row (always bottom row) */}
      <div className="p-5 pt-0 flex items-center justify-between border-t">
        <div className="text-sm font-semibold text-emerald-700">{price ?? 'Contact for pricing'}</div>
        {isContact ? (
          <Link
            href={href}
            className="inline-flex items-center rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Contact
          </Link>
        ) : (
          <Link
            href={href}
            className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Buy Report
          </Link>
        )}
      </div>
    </article>
  );
}

/* ================== Compact list rows for mobile ================== */

function PaidReportRow({ r }: { r: ReportCardModel }) {
  const cover = r.cover || '/images/report-cover-fallback.jpg';
  const price =
    typeof r.price === 'number' ? `$${r.price.toLocaleString()}` : undefined;

  const isContact = r.purchaseType === 'contact';
  const href = r.href ?? `/contact?topic=report&id=${encodeURIComponent(r.id)}&year=${r.year}`;

  return (
    <div className="flex gap-4 p-4">
      <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border bg-white">
        <Image src={cover} alt={r.title} fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{r.title}</h3>
          <div className="text-sm font-semibold text-emerald-700 whitespace-nowrap">
            {price ?? '—'}
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-700 line-clamp-2">{r.excerpt}</p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            {r.topic && <span className="rounded-full bg-gray-100 px-2 py-0.5">{r.topic}</span>}
            {r.category && <span className="rounded-full bg-gray-100 px-2 py-0.5">{r.category}</span>}
            <span>{r.year}</span>
          </div>

          {isContact ? (
            <Link
              href={href}
              className="inline-flex items-center rounded-full border border-emerald-600 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Contact
            </Link>
          ) : (
            <Link
              href={href}
              className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Buy
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

