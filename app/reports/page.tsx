// app/reports/page.tsx
'use client';

import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ReportCard from '@/app/reports/ReportCard';
import { CATALOG } from '@/lib/catalog';
import { toReportCardModel, isSmallReport, isSirBundle } from '@/lib/productUtils';
import type { ReportCardModel } from '@/types/reportModels';
import Link from 'next/link';

export default function ReportsHubPage() {
  const models: ReportCardModel[] = React.useMemo(() => {
    return CATALOG.filter((p) => isSmallReport(p) || isSirBundle(p)).map(toReportCardModel);
  }, []);

  const paid = models.filter((m) => m.badge === 'Paid');
  const free = models.filter((m) => m.badge === 'Free');

  return (
    <>
      <Header />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports' }]} />

      {/* Hero (keeps your original vibe; add a background image/video if you prefer) */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold">Reports</h1>
          <p className="mt-2 text-emerald-50 max-w-2xl">
            Explore paid 2025 reports or get complimentary 2024 insights.
          </p>

          {/* Jump pills (clear discoverability) */}
          <div className="mt-6 inline-flex gap-2">
            <a href="#paid" className="rounded-full bg-white text-emerald-800 px-4 py-2 text-sm font-semibold">
              View Paid ({paid.length})
            </a>
            <a href="#free" className="rounded-full border border-white/60 text-white px-4 py-2 text-sm font-semibold hover:bg-white/10">
              View Free ({free.length})
            </a>
          </div>
        </div>
      </section>

      <main className="bg-white">
        {/* Paid section */}
        <section id="paid" className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-3">
                <span className="h-2 w-2 rounded-full bg-amber-600" />
                <span className="text-black/60">Paid (2025)</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2025 Reports</h2>
              <p className="mt-2 text-gray-600">Flagship and focused reports available for purchase.</p>
            </div>
            <Link
              href="/reports/paid"
              className="rounded-full border border-emerald-600 px-4 py-2 text-emerald-700 text-sm font-semibold hover:bg-emerald-50"
            >
              View all paid
            </Link>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(paid.length ? paid : []).slice(0, 6).map((r) => (
              <ReportCard key={r.id} r={r} />
            ))}
            {paid.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
                Paid reports coming soon.
              </div>
            )}
          </div>
        </section>

        {/* Free section */}
        <section id="free" className="mx-auto max-w-7xl px-6 py-12 border-t border-gray-200">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                <span className="text-black/60">Free (2024)</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Free 2024 Reports</h2>
              <p className="mt-2 text-gray-600">Complimentary downloads (email gate).</p>
            </div>
            <Link
              href="/reports/free"
              className="rounded-full border border-emerald-600 px-4 py-2 text-emerald-700 text-sm font-semibold hover:bg-emerald-50"
            >
              View all free
            </Link>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(free.length ? free : []).slice(0, 6).map((r) => (
              <ReportCard key={r.id} r={r} onFreeDownload={() => (window.location.href = '/reports/free')} />
            ))}
            {free.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
                Free reports coming soon.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}















