// app/reports/page.tsx
'use client';

import * as React from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

import ReportCard from '@/app/reports/ReportCard';
import ReportFilters from '@/app/reports/ReportFilters';
import FreeDownloadModal from '@/app/reports/FreeDownloadModal';

import { CATALOG } from '@/lib/catalog';
import {
  toReportCardModel,
  isSmallReport,
  isSirBundle,
} from '@/lib/productUtils';

import type { ReportCardModel } from '@/types/reportModels';

export default function ReportsPage() {
  const [tab, setTab] = React.useState<'Free' | 'Paid'>('Free');

  // Build card models directly from the source of truth (catalog)
  const models: ReportCardModel[] = React.useMemo(() => {
    return CATALOG
      .filter((p) => isSmallReport(p) || isSirBundle(p)) // small reports + SIR bundles
      .map(toReportCardModel);                           // returns proper literal unions
  }, []);

  // Split by badge (business rule handled in toReportCardModel/isFreeOnHub)
  const freeModels = React.useMemo(
    () => models.filter((m) => m.badge === 'Free'),
    [models]
  );
  const paidModels = React.useMemo(
    () => models.filter((m) => m.badge === 'Paid'),
    [models]
  );

  // Active list and facets
  const active = tab === 'Free' ? freeModels : paidModels;

  // If you later map topics/categories from tags in productUtils, these will populate automatically
  const topics = React.useMemo(
    () => Array.from(new Set(active.map((r) => r.topic).filter(Boolean))) as string[],
    [active]
  );
  const categories = React.useMemo(
    () => Array.from(new Set(active.map((r) => r.category).filter(Boolean))) as string[],
    [active]
  );

  // Filters
  const [query, setQuery] = React.useState('');
  const [topic, setTopic] = React.useState('All');
  const [category, setCategory] = React.useState('All');

  const filtered = React.useMemo(() => {
    return active.filter((r) => {
      const matchesQ = [r.title, r.excerpt, r.topic, r.category]
        .filter(Boolean)
        .some((t) => t!.toLowerCase().includes(query.toLowerCase()));
      const matchesTopic = topic === 'All' || r.topic === topic;
      const matchesCat = category === 'All' || r.category === category;
      return matchesQ && matchesTopic && matchesCat;
    });
  }, [active, query, topic, category]);

  // Modal for free downloads
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeReport, setActiveReport] = React.useState<ReportCardModel | undefined>(undefined);

  const openDownload = (r: ReportCardModel) => {
    setActiveReport(r);
    setModalOpen(true);
  };

  // Contact-first paid flow (if any paid items use purchaseType='contact')
  const onContact = (r: ReportCardModel) => {
    window.location.href = `/contact?topic=report&id=${encodeURIComponent(r.id)}&year=${r.year}`;
  };

  return (
    <>
      <Header />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports' }]} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold">Reports</h1>
          <p className="mt-2 text-emerald-50 max-w-2xl">
            Explore complimentary 2024 insights or purchase the latest 2025 reports.
          </p>

          {/* Tabs */}
          <div className="mt-6 inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/20">
            {(['Free', 'Paid'] as const).map((t) => {
              const isActive = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                    isActive ? 'bg-white text-emerald-800' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {t === 'Free' ? 'Free (2024)' : 'Paid (2025)'}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="bg-white">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReportFilters
            query={query}
            setQuery={setQuery}
            topic={topic}
            setTopic={setTopic}
            category={category}
            setCategory={setCategory}
            topics={topics}
            categories={categories}
          />

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <ReportCard
                key={r.id}
                r={r}
                onFreeDownload={tab === 'Free' ? openDownload : undefined}
                onContact={tab === 'Paid' ? onContact : undefined}
              />
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
                No reports match your filters.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Gated download modal for free reports */}
      <FreeDownloadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        report={
          activeReport
            ? { id: activeReport.id, title: activeReport.title, fileUrl: undefined }
            : undefined
        }
      />
    </>
  );
}













