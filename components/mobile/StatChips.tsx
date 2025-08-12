'use client';

import React from 'react';

export function StatChips({
  stats,
}: {
  stats: { label: string; sub: string }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <div className="text-base font-bold text-emerald-700">{s.label}</div>
          <div className="mt-0.5 text-[11px] text-slate-600">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}