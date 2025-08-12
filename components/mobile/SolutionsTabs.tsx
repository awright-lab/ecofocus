'use client';

import React, { useState } from 'react';

export function SolutionsTabs({
  tabs,
}: {
  tabs: { key: string; title: string; bullets: string[]; cta: { label: string; href: string } }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key ?? '');
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className="space-y-3">
      <div className="flex rounded-full bg-slate-100 p-1 text-sm">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`flex-1 rounded-full px-3 py-2 font-medium transition ${
              active === t.key ? 'bg-white shadow' : 'text-slate-600'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {current && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {current.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <a href={current.cta.href} className="mt-3 inline-block rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
            {current.cta.label}
          </a>
        </div>
      )}
    </div>
  );
}