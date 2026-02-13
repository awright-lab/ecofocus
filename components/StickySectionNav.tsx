// components/StickySectionNav.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { id: string; label: string };

type StickySectionNavProps = {
  items: Item[];
  mobileLabel?: string;
  topOffset?: number;
};

export default function StickySectionNav({
  items,
  mobileLabel = 'Jump to section',
  topOffset = 80,
}: StickySectionNavProps) {
  const [active, setActive] = React.useState<string>(items[0]?.id ?? '');
  const pathname = usePathname();

  React.useEffect(() => {
    if (!items.length) return;

    const observers: IntersectionObserver[] = [];
    const opts: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -60% 0px',
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

    return () => observers.forEach((observer) => observer.disconnect());
  }, [items]);

  const scrollToSection = React.useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.scrollY - topOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', `${pathname}#${id}`);
      setActive(id);
    },
    [pathname, topOffset],
  );

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <div className="sticky top-14 z-30 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:top-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Section navigation" className="py-2">
          <div className="hide-scrollbar hidden gap-4 overflow-x-auto md:flex">
            {items.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <Link
                  key={id}
                  href={`#${id}`}
                  onClick={(event) => onLinkClick(event, id)}
                  className={`relative whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {label}
                  <span
                    className={`absolute -bottom-px left-0 right-0 h-[2px] rounded-full transition-opacity ${
                      isActive ? 'bg-emerald-600 opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>

          <div className="md:hidden">
            <label htmlFor="section-nav-mobile" className="sr-only">
              {mobileLabel}
            </label>
            <select
              id="section-nav-mobile"
              value={active}
              onChange={(event) => scrollToSection(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </div>
  );
}
