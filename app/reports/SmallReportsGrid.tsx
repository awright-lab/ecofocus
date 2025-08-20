'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/storeTypes';
import { ArrowRight, BadgeDollarSign, Filter, Search } from 'lucide-react';

type Props = {
  pageSlice: Product[];           // pass SMALL_REPORTS or any subset
  addToCart: (id: string) => void;
};

export default function SmallReportsGrid({ pageSlice, addToCart }: Props) {
  // ---- Tags from catalog.ts (exclude year tags like "2024"/"2025") ----------
  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of pageSlice) {
      (p.tags ?? [])
        .filter((t) => !/^\d{4}$/.test(t)) // remove year tags
        .forEach((t) => s.add(t));
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [pageSlice]);

  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    allTags.forEach((t) => m.set(t, 0));
    for (const p of pageSlice) {
      for (const t of (p.tags ?? []).filter((t) => !/^\d{4}$/.test(t))) {
        m.set(t, (m.get(t) || 0) + 1);
      }
    }
    return m;
  }, [pageSlice, allTags]);

  // ---- Sidebar state ---------------------------------------------------------
  const [selected, setSelected] = useState<Set<string>>(() => new Set(allTags)); // default: all
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false); // mobile toggle

  // Keep selection in sync if data/tags change
  useEffect(() => {
    setSelected((prev) => {
      const next = new Set<string>();
      for (const t of allTags) if (prev.size === 0 || prev.has(t)) next.add(t);
      return next.size ? next : new Set(allTags);
    });
  }, [allTags]);

  const visibleTagList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTags.filter((t) => (q ? t.toLowerCase().includes(q) : true));
  }, [allTags, query]);

  const toggleTag = (t: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(allTags));
  const clearAll = () => setSelected(new Set());

  // ---- Filtering + 3×2 grid enforcement -------------------------------------
  const filtered = useMemo(() => {
    if (selected.size === 0) return [];
    return pageSlice.filter((p) =>
      (p.tags ?? []).some((t) => !/^\d{4}$/.test(t) && selected.has(t))
    );
  }, [pageSlice, selected]);

  const visibleReports = filtered.slice(0, 6); // 3 columns × 2 rows

  return (
    <section id="reports" className="container mx-auto px-4 py-10">
      {/* Header + mobile filter toggle */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold"></h2>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 lg:hidden"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Layout: sidebar + grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
        {/* Sidebar */}
        <aside
          className={`rounded-2xl border bg-white p-4 shadow-sm lg:block ${
            showFilters ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filter by category</h3>
            <span className="text-xs text-gray-500">{filtered.length} matching</span>
          </div>

          {/* Pill-shaped search */}
          <div className="mt-3 relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Bulk actions */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
            >
              Clear
            </button>
          </div>

          {/* Checkbox list — no scroll, full height */}
          <ul className="mt-3 space-y-2">
            {visibleTagList.length === 0 ? (
              <li className="text-sm text-gray-500">No categories found.</li>
            ) : (
              visibleTagList.map((t) => {
                const checked = selected.has(t);
                const count = tagCounts.get(t) ?? 0;
                return (
                  <li key={t} className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTag(t)}
                        className="h-4 w-4 rounded border-gray-300 accent-emerald-600 focus:ring-2 focus:ring-emerald-500/40"
                      />
                      <span className="text-gray-800">{t}</span>
                    </label>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                      {count}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        {/* Grid (locked to 3 columns on desktop) */}
        {visibleReports.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-gray-600">
            No small reports match your selected categories.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleReports.map((p) => {
              const yearLabel =
                p.year !== undefined && p.year !== null ? String(p.year) : undefined;

              // NEW: derive purchase mode (default: Reports -> direct, Bundles -> contact)
              const isDirect =
                (p.purchaseType ??
                  (p.category === 'Reports' ? 'direct' : 'contact')) === 'direct';

              const priceText =
                typeof p.price === 'number' ? `$${p.price.toLocaleString()}` : undefined;

              return (
                <article
                  key={p.id}
                  className="group relative rounded-xl border bg-white/90 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden transition-shadow hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                >
                  {/* Media */}
                  <div className="relative aspect-[16/10]">
                    {yearLabel && (
                      <span className="absolute left-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow">
                        {yearLabel}
                      </span>
                    )}

                    {p.img ? (
                      <>
                        <Image
                          src={p.img}
                          alt={p.title}
                          fill
                          className="object-cover saturate-[.85] group-hover:saturate-100 transition"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="h-8 w-32 animate-pulse rounded-full bg-gray-300/70" />
                      </div>
                    )}

                    {/* Price/Type pill */}
                    <div className="absolute -bottom-3 left-3 z-20">
                      <div className="rounded-lg bg-white shadow border px-3 py-1.5">
                        <span className="text-[10px] text-gray-500">
                          {p.category === 'Reports' ? 'Report' : 'Service'}
                        </span>
                        <div className="text-base font-bold text-emerald-700 leading-4">
                          {isDirect && priceText ? priceText : 'Contact'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 pt-6">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">{p.title}</h3>

                    {/* Actions */}
                    <div className="mt-2 flex items-center gap-1.5">
                      {isDirect ? (
                        <button
                          onClick={() => addToCart(p.id)}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
                          aria-label={`Buy ${p.title}`}
                        >
                          Buy now
                          <BadgeDollarSign className="h-4 w-4" />
                        </button>
                      ) : (
                        <Link
                          href={p.contactPath ?? `/contact?product=${p.id}`}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                          aria-label={`Contact about ${p.title}`}
                        >
                          {p.ctaLabel ?? 'Schedule discovery'}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}

                      <Link
                        href={`/reports/${p.id}`}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                      >
                        Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}





