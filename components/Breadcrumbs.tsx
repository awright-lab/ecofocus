// components/Breadcrumbs.tsx
'use client';

import Link from 'next/link';

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items, maxWidth = 'max-w-7xl' }: { items: Crumb[]; maxWidth?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full py-4 bg-white border-b border-gray-100"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className={`mx-auto ${maxWidth} px-4 sm:px-6 flex flex-wrap items-center gap-2 text-sm text-gray-600`}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={`${item.label}-${idx}`}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-gray-900"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span itemProp="name" aria-current="page" className="text-gray-900">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(idx + 1)} />
              {!isLast && <span className="text-gray-300">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

