'use client';

import React from 'react';

export function ReportCardFeatured({
  title,
  price,
  bullets,
  ctaHref,
}: {
  title: string;
  price: number;
  bullets: string[];
  ctaHref: string;
}) {
  const priceStr = `$${price.toLocaleString()}`;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-emerald-200 to-teal-200" />
        <div>
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
          <div className="mt-1 text-sm text-slate-600">Comprehensive 2025 analysis of consumer sustainability attitudes & behaviors.</div>
        </div>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{priceStr}</span>
          <span className="ml-1">one-time</span>
        </div>
        <a href={ctaHref} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Buy Report</a>
      </div>
    </article>
  );
}
