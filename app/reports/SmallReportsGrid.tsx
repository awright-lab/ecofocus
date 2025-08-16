'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/storeTypes';
import { ArrowRight, BadgeDollarSign, Filter, Search } from 'lucide-react';

type Props = {
  pageSlice: Product[];
  addToCart: (id: string) => void;
};

const UNCATEGORIZED = 'Uncategorized';

export default function SmallReportsGrid({ pageSlice, addToCart }: Props) {
  // Build unique category list from products (fallback to "Uncategorized")
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const p of pageSlice) {
      const cats = (p as any).categories as string[] | undefined;
      if (Array.isArray(cats) && cats.length) {
        cats.forEach((c) => set.add(c));
      } else {
        set.add(UNCATEGORIZED);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [pageSlice]);

  // Category counts (for badges)
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of allCategories) counts.set(c, 0);
    for (const p of pageSlice) {
      const cats = (p as any).categories as string[] | undefined;
      const list = Array.isArray(cats) && cats.length ? cats : [UNCATEGORIZED];
      for (const c of list) counts.set(c, (counts.get(c) || 0) + 1);
    }
    return counts;
  }, [pageSlice, allCategories]);

  // Selections
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(allCategories) // default: all selected
  );
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false); // mobile toggle

  const visibleCategoryList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCategories.filter((c) => (q ? c.toLowerCase().includes(q) : true));
  }, [allCategories, query]);

  const toggleCategory = (c: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(allCategories));
  const clearAll = () => setSelected(new Set());

  // Filter products by selected categories
  const filtered = useMemo(() => {
    if (selected.size === 0) return [];
    return pageSlice.filter((p) => {
      const cats = (p as any).categories as string[] | undefined;
      const list = Array.isArray(cats) && cats.length ? cats : [UNCATEGORIZED];
      // include if any product category is selected
      return list.some((c) => selected.has(c));
    });
  }, [pageSlice, selected]);

  // Enforce 3×2 (six items)
  const visibleReports = filtered.slice(0, 6);

  return (
    <section id="reports" className="container mx-auto px-4 py-10">
      {/* Header + mobile filter toggle */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Small Reports</h2>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 lg:hidden"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* 2-column layout on desktop: sidebar + grid */}
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

          {/* Search */}
          <div className="mt-3 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border px-8 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
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

          {/* Checkbox list */}
          <div className="mt-3 max-h-72 overflow-auto pr-1">
            {visibleCategoryList.length === 0 ? (
              <p className="text-sm text-gray-500">No categories found.</p>
            ) : (
              <ul className="space-y-2">
                {visibleCategoryList.map((c) => {
                  const checked = selected.has(c);
                  const count = categoryCounts.get(c) || 0;
                  return (
                    <li key={c} className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          checked={checked}
                          onChange={() => toggleCategory(c)}
                        />
                        <span className="text-gray-800">{c}</span>
                      </label>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                        {count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Grid (lock to 3 columns on desktop) */}
        {visibleReports.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-gray-600">
            No small reports match your selected categories.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleReports.map((p) => {
              const yearLabel =
                (p as any).year !== undefined && (p as any).year !== null
                  ? String((p as any).year)
                  : undefined;

              return (
                <article
                  key={p.id}
                  className="group relative rounded-xl border bg-white/90 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden transition-shadow hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                >
                  {/* Media (short, secondary) */}
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

                    {/* Price pill (small) */}
                    <div className="absolute -bottom-3 left-3 z-20">
                      <div className="rounded-lg bg-white shadow border px-3 py-1.5">
                        <span className="text-[10px] text-gray-500">Report</span>
                        <div className="text-base font-bold text-emerald-700 leading-4">
                          ${p.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body (compact) */}
                  <div className="p-3 pt-6">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">{p.title}</h3>

                    {/* Actions */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <button
                        onClick={() => addToCart(p.id)}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
                      >
                        Add
                        <BadgeDollarSign className="h-4 w-4" />
                      </button>
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



