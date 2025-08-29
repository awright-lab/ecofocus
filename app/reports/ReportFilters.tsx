// components/reports/ReportFilters.tsx
'use client';

import * as React from 'react';

type Props = {
  query: string;
  setQuery: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  topics: string[];
  categories: string[];
};

export default function ReportFilters({
  query, setQuery,
  topic, setTopic,
  category, setCategory,
  topics, categories,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search reports…"
        className="h-11 w-full md:w-72 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
      />

      <div className="flex flex-wrap gap-2">
        <Select value={topic} onChange={setTopic} label="Topic" options={['All', ...topics]} />
        <Select value={category} onChange={setCategory} label="Category" options={['All', ...categories]} />
      </div>
    </div>
  );
}

function Select({ value, onChange, label, options }:{
  value: string; onChange:(v:string)=>void; label:string; options:string[];
}) {
  return (
    <label className="text-sm text-gray-700 flex items-center gap-2">
      <span className="text-gray-600">{label}</span>
      <select
        className="h-10 rounded-lg border border-gray-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
