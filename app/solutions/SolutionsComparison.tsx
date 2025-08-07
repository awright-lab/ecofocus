'use client';

import { motion } from 'framer-motion';
import { Check, Minus, X, Sparkles } from 'lucide-react';

type Cell = boolean | string;

type ColumnKey = 'syndicated' | 'custom' | 'infusion';

type Column = {
  key: ColumnKey;
  label: string;
  color: string; // tailwind gradient classes
  featured?: boolean; // optional
};

const FEATURES: { label: string; note?: string; cells: Record<ColumnKey, Cell> }[] = [
  { label: 'Benchmarking vs. Market', cells: { syndicated: true, custom: 'Optional add‑on', infusion: true } },
  { label: 'Proprietary Insights', cells: { syndicated: false, custom: true, infusion: 'Wraps your data' } },
  { label: 'Integrates with Brand Data', cells: { syndicated: 'Export & manual merge', custom: 'By scope', infusion: true } },
  { label: 'Year‑over‑Year Tracking', cells: { syndicated: true, custom: 'If longitudinal', infusion: true } },
  { label: 'Speed to Value', cells: { syndicated: 'Instant dashboard', custom: '2–6 weeks', infusion: 'Fast once data connected' } },
  { label: 'Depth of Segmentation', cells: { syndicated: 'Rich gen/demo/CAT', custom: 'As designed', infusion: 'Syndicated + your cuts' } },
  { label: 'Cost Efficiency', cells: { syndicated: 'Best $/insight', custom: 'Varies by scope', infusion: 'High ROI w/ existing data' } },
  { label: 'AI‑Assisted Patterns', cells: { syndicated: true, custom: true, infusion: true } },
];

const COLS: Column[] = [
  { key: 'syndicated', label: 'Syndicated',   color: 'from-[#00767a] to-[#2C7FB8]' },
  { key: 'custom',     label: 'Custom',       color: 'from-[#dd803e] to-[#FFD26F]' },
  { key: 'infusion',   label: 'Data Infusion',color: 'from-[#9bbd3f] to-[#56a96f]', featured: true },
];

function CellContent(value: Cell) {
  if (value === true)  return <Check className="w-5 h-5 text-emerald-600" aria-label="Included" />;
  if (value === false) return <X className="w-5 h-5 text-gray-400" aria-label="Not included" />;
  return <span className="text-[13px] text-gray-700">{value}</span>;
}

export default function SolutionsComparison() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Compare Our Solutions
          </motion.h2>
          <p className="text-gray-600 mt-3">
            Quickly see which option fits your use case. <span className="font-medium">Data Infusion</span> is highlighted as the most versatile.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="overflow-visible rounded-2xl border border-gray-200 shadow-sm">
            {/* Column Headers */}
            <div className="grid grid-cols-4 bg-gray-50">
              <div className="p-4 text-sm font-semibold text-gray-600">Benefits & Features</div>
              {COLS.map((c) => (
                <div key={c.key} className="relative p-4">
                  <div className={`rounded-lg px-4 py-3 text-center text-white font-semibold bg-gradient-to-r ${c.color} shadow-sm`}>
                    {c.label}
                  </div>
                  {c.featured && (
                    <div className="absolute -top-3 right-4 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-semibold text-white shadow">
                      <Sparkles className="w-3.5 h-3.5" />
                      Most Versatile
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-200">
              {FEATURES.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4">
                  <div className="p-4">
                    <div className="text-sm font-medium text-gray-900">{row.label}</div>
                    {row.note && <div className="text-xs text-gray-500 mt-0.5">{row.note}</div>}
                  </div>
                  {COLS.map((c) => (
                    <div key={c.key} className="p-4 flex items-center justify-center">
                      {CellContent(row.cells[c.key])}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-8">
          {COLS.map((col) => (
            <div
              key={col.key}
              className={`rounded-2xl border ${col.featured ? 'border-emerald-300 shadow-md' : 'border-gray-200 shadow-sm'}`}
            >
              <div className={`rounded-t-2xl bg-gradient-to-r ${col.color} px-5 py-4 text-white font-semibold flex items-center justify-between`}>
                <span>{col.label}</span>
                {col.featured && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-700/80 px-2.5 py-0.5 text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Versatile
                  </span>
                )}
              </div>
              <ul className="divide-y divide-gray-100">
                {FEATURES.map((row, i) => (
                  <li key={i} className="flex items-start justify-between gap-4 px-5 py-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{row.label}</div>
                      {row.note && <div className="text-xs text-gray-500">{row.note}</div>}
                    </div>
                    <div className="shrink-0">{CellContent(row.cells[col.key])}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
          <div className="inline-flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> Included
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Minus className="w-4 h-4 text-gray-400" /> Varies / Partial
          </div>
          <div className="inline-flex items-center gap-1.5">
            <X className="w-4 h-4 text-gray-400" /> Not Included
          </div>
        </div>
      </div>
    </section>
  );
}

