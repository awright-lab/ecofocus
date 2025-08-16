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
    <section className="bg-white/70">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-3">
        {/* Search pill */}
        <div className="ml-auto flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus-within:ring-2 focus-within:ring-emerald-500">
          <Filter className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search small reports…"
            className="w-48 md:w-64 bg-transparent outline-none placeholder-gray-400"
            aria-label="Search small reports"
          />
        </div>

        {/* Year dropdown */}
        <label className="sr-only" htmlFor="sr-year">
          Filter by year
        </label>
        <div className="relative">
          <select
            id="sr-year"
            value={year}
            onChange={(e) =>
              onYear(e.target.value === 'All' ? 'All' : Number(e.target.value))
            }
            className="appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
          >
            <option value="All">All years</option>
            {yearsAvailable.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Custom caret */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="h-4 w-4 text-emerald-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

