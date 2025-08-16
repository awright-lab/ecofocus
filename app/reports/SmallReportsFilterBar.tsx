'use client';

import { Filter } from 'lucide-react';

type Year = 'All' | number;

export default function SmallReportsFilterBar({
  query,
  onQuery,
  year,
  onYear,
  yearsAvailable,
}: {
  query: string;
  onQuery: (v: string) => void;
  year: Year;
  onYear: (v: Year) => void;
  yearsAvailable: number[];
}) {
  return (
    <section className="border-y border-gray-200 bg-white/70">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-3">
        <div className="text-sm font-semibold text-gray-900"></div>

        <div className="ml-auto flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
          <Filter className="h-4 w-4" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search small reports…"
            className="w-48 md:w-64 bg-transparent outline-none"
            aria-label="Search small reports"
          />
        </div>

        <label className="sr-only" htmlFor="sr-year">Filter by year</label>
        <select
          id="sr-year"
          value={year}
          onChange={(e) => onYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
          className="rounded-full border px-4 py-2 text-sm"
        >
          <option value="All">All years</option>
          {yearsAvailable.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
