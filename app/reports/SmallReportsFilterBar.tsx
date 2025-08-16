'use client';

import { Fragment, useMemo } from 'react';
import { Listbox } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';

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
  const options: Year[] = useMemo(() => ['All', ...yearsAvailable], [yearsAvailable]);

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

        {/* Year dropdown with Framer Motion animation */}
        <Listbox value={year} onChange={onYear}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="flex items-center justify-between rounded-full border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-40">
                {year === 'All' ? 'All years' : year}
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-emerald-500" />
              </Listbox.Button>

              <AnimatePresence>
                {open && (
                  <Listbox.Options
                    as={motion.ul}
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      scale: 0.98,
                      transition: { duration: 0.12, ease: 'easeInOut' },
                    }}
                    className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-xl border border-emerald-100 bg-white py-1 shadow-lg focus:outline-none"
                  >
                    {options.map((opt) => (
                      <Listbox.Option key={String(opt)} value={opt} as={Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={[
                              'cursor-pointer px-4 py-2 text-sm',
                              active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900',
                              selected ? 'font-semibold' : 'font-normal',
                            ].join(' ')}
                          >
                            {opt === 'All' ? 'All years' : opt}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </AnimatePresence>
            </div>
          )}
        </Listbox>
      </div>
    </section>
  );
}


