'use client';

import React, { useRef } from 'react';

export function NuggetCarousel({
  items,
}: {
  items: { id: string; title: string; tag: string; href: string }[];
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative">
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
      >
        {items.map((n) => (
          <a
            key={n.id}
            href={n.href}
            className="snap-start shrink-0 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">{n.tag}</div>
            <div className="mt-1 text-base font-semibold leading-snug">{n.title}</div>
            <div className="mt-2 h-24 w-full rounded-lg bg-gradient-to-tr from-emerald-100 to-teal-100" />
            <div className="mt-2 text-sm font-medium text-emerald-700">Read insight →</div>
          </a>
        ))}
      </div>
    </div>
  );
}