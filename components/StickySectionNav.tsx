// components/StickySectionNav.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { id: string; label: string };

export default function StickySectionNav({ items }: { items: Item[] }) {
  const [active, setActive] = React.useState<string>(items[0]?.id ?? '');
  const pathname = usePathname();

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const opts: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -60% 0px', // triggers when top of section crosses ~40% viewport
      threshold: 0,
    };

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(id);
        });
      }, opts);

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    // smooth scroll with offset for sticky header
    const y = el.getBoundingClientRect().top + window.scrollY - 80; // adjust if your header height differs
    window.scrollTo({ top: y, behavior: 'smooth' });
    // Update hash without jumping
    history.replaceState(null, '', `${pathname}#${id}`);
  };

  return (
    <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Section navigation" className="flex gap-4 overflow-x-auto hide-scrollbar">
          {items.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <Link
                key={id}
                href={`#${id}`}
                onClick={(e) => onClick(e, id)}
                className={`relative py-3 text-sm font-medium whitespace-nowrap transition-colors
                  ${isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-gray-900'}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {label}
                <span
                  className={`absolute left-0 right-0 -bottom-px h-[2px] rounded-full transition-opacity
                    ${isActive ? 'bg-emerald-600 opacity-100' : 'opacity-0'}`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
