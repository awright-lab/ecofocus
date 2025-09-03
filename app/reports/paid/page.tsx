// app/reports/paid/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PaidHero from './PaidHero';

import { CATALOG } from '@/lib/catalog';
import { toReportCardModel, isSmallReport, isSirBundle } from '@/lib/productUtils';
import type { ReportCardModel } from '@/types/reportModels';

import { LayoutGrid, List, Filter, X, ChevronDown } from 'lucide-react';

export default function PaidReportsPage() {
  // Build models (only "Paid")
  const models: ReportCardModel[] = React.useMemo(() => {
    return CATALOG
      .filter((p) => isSmallReport(p) || isSirBundle(p))
      .map(toReportCardModel)
      .filter((m) => m.badge === 'Paid');
  }, []);

  // Derive filter options
  const allTopics = React.useMemo(
    () => Array.from(new Set(models.map(m => m.topic).filter(Boolean))) as string[],
    [models]
  );
  const allCategories = React.useMemo(
    () => Array.from(new Set(models.map(m => m.category).filter(Boolean))) as string[],
    [models]
  );
  const allYears = React.useMemo(
    () => Array.from(new Set(models.map(m => m.year).filter(Boolean))).sort((a, b) => (b as number) - (a as number)) as number[],
    [models]
  );

  // UI state
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [visible, setVisible] = React.useState(9); // modest default for mobile
  const [query, setQuery] = React.useState('');
  const [topics, setTopics] = React.useState<Set<string>>(new Set());
  const [categories, setCategories] = React.useState<Set<string>>(new Set());
  const [years, setYears] = React.useState<Set<number>>(new Set());
  const [filtersOpen, setFiltersOpen] = React.useState(false); // mobile drawer

  // Helpers
  const toggleSet = <T,>(set: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) => {
    set(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const clearAll = () => {
    setQuery('');
    setTopics(new Set());
    setCategories(new Set());
    setYears(new Set());
  };

  // Filtering
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return models.filter(m => {
      if (q) {
        const hay = `${m.title} ${m.excerpt ?? ''} ${m.topic ?? ''} ${m.category ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (topics.size && (!m.topic || !topics.has(m.topic))) return false;
      if (categories.size && (!m.category || !categories.has(m.category))) return false;
      if (years.size && (!m.year || !years.has(m.year as number))) return false;
      return true;
    });
  }, [models, query, topics, categories, years]);

  // Pagination slice
  const shown = filtered.slice(0, visible);
  const loadMore = () => setVisible(v => v + (view === 'grid' ? 9 : 15));

  // Reset pagination when filters/search change
  React.useEffect(() => {
    setVisible(9);
  }, [query, topics, categories, years, view]);

  return (
    <>
      <Header />

      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Reports', href: '/reports' },
        { label: 'Paid' }
      ]} />

      <PaidHero />

      {/* Controls bar (white, no gradient/hero copy) */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative w-full md:max-w-sm">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reports…"
                aria-label="Search paid reports"
                className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <svg
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Filter toggles (mobile collapsible) */}
            <div className="md:hidden">
              <button
                onClick={() => setFiltersOpen(o => !o)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* View toggle */}
            <div className="md:ml-auto">
              <div className="inline-flex rounded-full border border-gray-300 p-1">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${
                    view === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Grid
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${
                    view === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-4 w-4" /> Compact
                </button>
              </div>
            </div>
          </div>

          {/* Filters row (desktop) */}
          <div className="mt-3 hidden md:flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Topic"
              options={allTopics}
              selected={topics}
              onToggle={(val) => toggleSet(setTopics, val)}
            />
            <FilterDropdown
              label="Category"
              options={allCategories}
              selected={categories}
              onToggle={(val) => toggleSet(setCategories, val)}
            />
            <FilterDropdown
              label="Year"
              options={allYears.map(String)}
              selected={new Set(Array.from(years).map(String))}
              onToggle={(val) => toggleSet(setYears, Number(val))}
            />
            {(query || topics.size || categories.size || years.size) ? (
              <button
                onClick={clearAll}
                className="ml-auto inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" /> Clear all
              </button>
            ) : null}
          </div>

          {/* Filters drawer (mobile) */}
          {filtersOpen && (
            <div className="mt-3 md:hidden">
              <div className="rounded-2xl border p-4 space-y-4">
                <FilterGroup
                  label="Topic"
                  options={allTopics}
                  selected={topics}
                  onToggle={(val) => toggleSet(setTopics, val)}
                />
                <FilterGroup
                  label="Category"
                  options={allCategories}
                  selected={categories}
                  onToggle={(val) => toggleSet(setCategories, val)}
                />
                <FilterGroup
                  label="Year"
                  options={allYears.map(String)}
                  selected={new Set(Array.from(years).map(String))}
                  onToggle={(val) => toggleSet(setYears, Number(val))}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">{filtered.length} results</div>
                  <button
                    onClick={() => { clearAll(); setFiltersOpen(false); }}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-3.5 w-3.5" /> Clear all
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main */}
      <main className="bg-white">
        <section className="mx-auto max-w-7xl px-6 py-8">
          {/* Results count + active chips */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filtered.length}</span> results
            {query ? <Chip onClear={() => setQuery('')}>Search: “{query}”</Chip> : null}
            {Array.from(topics).map(t => <Chip key={`t-${t}`} onClear={() => toggleSet(setTopics, t)}>{t}</Chip>)}
            {Array.from(categories).map(c => <Chip key={`c-${c}`} onClear={() => toggleSet(setCategories, c)}>{c}</Chip>)}
            {Array.from(years).map(y => <Chip key={`y-${y}`} onClear={() => toggleSet(setYears, y)}>{y}</Chip>)}
          </div>

          {/* Grid view */}
          {view === 'grid' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((r) => <PaidReportCard key={r.id} r={r} />)}
            </div>
          )}

          {/* List view (compact, mobile-friendly) */}
          {view === 'list' && (
            <div className="divide-y divide-gray-200 rounded-xl border">
              {shown.map((r) => <PaidReportRow key={r.id} r={r} />)}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
              No paid reports match your filters.
              <div className="mt-4">
                <button
                  onClick={clearAll}
                  className="inline-flex items-center rounded-full border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {/* Load more */}
          {visible < filtered.length && (
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

/* ================== Small UI helpers ================== */

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs">
      {children}
      <button aria-label="Remove filter" onClick={onClear} className="text-gray-500 hover:text-gray-800">
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function FilterDropdown<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: T[];
  selected: Set<T>;
  onToggle: (value: T) => void;
}) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50">
        <Filter className="h-4 w-4 text-gray-700" />
        {label}
        {selected.size ? (
          <span className="ml-1 rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
            {selected.size}
          </span>
        ) : null}
        <ChevronDown className="ml-1 h-4 w-4 text-gray-600 transition group-open:rotate-180" />
      </summary>
      <div className="absolute z-20 mt-2 w-56 rounded-xl border bg-white p-2 shadow-lg">
        <ul className="max-h-64 overflow-auto text-sm">
          {options.map((opt) => {
            const active = selected.has(opt as T);
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => onToggle(opt as T)}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 ${
                    active ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {active ? <span className="text-[10px] font-semibold">Selected</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: T[];
  selected: Set<T>;
  onToggle: (value: T) => void;
}) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-800">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.has(opt as T);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt as T)}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                active
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-gray-300 bg-white text-gray-800'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================== Cards that align perfectly ================== */

function PaidReportCard({ r }: { r: ReportCardModel }) {
  const cover = r.cover || '/images/report-cover-fallback.jpg';
  const price = typeof r.price === 'number' ? `$${r.price.toLocaleString()}` : undefined;
  const isContact = r.purchaseType === 'contact';
  const href = r.href ?? `/contact?topic=report&id=${encodeURIComponent(r.id)}&year=${r.year}`;

  return (
    <article
      className="
        group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-300 transition
        grid grid-rows-[auto_1fr_auto] h-full overflow-hidden
      "
    >
      <div className="relative aspect-[16/9]">
        <Image src={cover} alt={r.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">{r.title}</h3>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3 min-h-[3.5rem]">{r.excerpt}</p>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          {r.topic && <span className="rounded-full bg-gray-100 px-2 py-0.5">{r.topic}</span>}
          {r.category && <span className="rounded-full bg-gray-100 px-2 py-0.5">{r.category}</span>}
          <span className="ml-auto">{r.year}</span>
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center justify-between border-t">
        <div className="text-sm font-semibold text-emerald-700">{price ?? 'Contact for pricing'}</div>
        {isContact ? (
          <Link href={href} className="inline-flex items-center rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
            Contact
          </Link>
        ) : (
          <Link href={href} className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
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
  const price = typeof r.price === 'number' ? `$${r.price.toLocaleString()}` : undefined;
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
          <div className="text-sm font-semibold text-emerald-700 whitespace-nowrap">{price ?? '—'}</div>
        </div>
        <p className="mt-1 text-xs text-gray-700 line-clamp-2">{r.excerpt}</p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            {r.topic && <span className="rounded-full bg-gray-100 px-2 py-0.5">{r.topic}</span>}
            {r.category && <span className="rounded-full bg-gray-100 px-2 py-0.5">{r.category}</span>}
            <span>{r.year}</span>
          </div>

          {isContact ? (
            <Link href={href} className="inline-flex items-center rounded-full border border-emerald-600 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
              Contact
            </Link>
          ) : (
            <Link href={href} className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
              Buy
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

