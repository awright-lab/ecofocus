// app/reports/paid/page.tsx
'use client';

import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ReportCard from '@/app/reports/ReportCard';
import ReportFilters from '@/app/reports/ReportFilters';
import { CATALOG } from '@/lib/catalog';
import { toReportCardModel, isSmallReport, isSirBundle } from '@/lib/productUtils';
import type { ReportCardModel } from '@/types/reportModels';

export default function PaidReportsPage() {
  const models: ReportCardModel[] = React.useMemo(() => {
    return CATALOG.filter((p) => isSmallReport(p) || isSirBundle(p)).map(toReportCardModel);
  }, []);

  const paid = models.filter((m) => m.badge === 'Paid');

  // Optional facet mapping if you later wire topic/category
  const topics = Array.from(new Set(paid.map((r) => r.topic).filter(Boolean))) as string[];
  const categories = Array.from(new Set(paid.map((r) => r.category).filter(Boolean))) as string[];

  const [query, setQuery] = React.useState('');
  const [topic, setTopic] = React.useState('All');
  const [category, setCategory] = React.useState('All');

  const filtered = paid.filter((r) => {
    const q = query.toLowerCase();
    const matchesQ = [r.title, r.excerpt, r.topic, r.category].filter(Boolean).some((t) => t!.toLowerCase().includes(q));
    const matchesTopic = topic === 'All' || r.topic === topic;
    const matchesCat = category === 'All' || r.category === category;
    return matchesQ && matchesTopic && matchesCat;
  });

  const onContact = (r: ReportCardModel) => {
    window.location.href = `/contact?topic=report&id=${encodeURIComponent(r.id)}&year=${r.year}`;
  };

  return (
    <>
      <Header />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports', href: '/reports' }, { label: 'Paid' }]} />

      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold">Paid Reports (2025)</h1>
          <p className="mt-2 text-emerald-50 max-w-2xl">Purchase flagship and focused 2025 reports.</p>
        </div>
      </section>

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
              <ReportCard key={r.id} r={r} onContact={onContact} />
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
    </>
  );
}
