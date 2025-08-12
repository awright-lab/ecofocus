'use client';

import React from 'react';
import { Home, Layers, BookText, Sparkles, Phone } from 'lucide-react';

const iconMap = {
  home: Home,
  layers: Layers,
  book: BookText,
  sparkles: Sparkles,
  phone: Phone,
};

export function BottomNav({
  items,
}: {
  items: { href: string; label: string; icon: keyof typeof iconMap }[];
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => {
          const Icon = iconMap[it.icon];
          return (
            <li key={it.href} className="">
              <a
                href={it.href}
                className="flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium text-slate-700 hover:text-emerald-700"
              >
                <Icon className="h-5 w-5" />
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}