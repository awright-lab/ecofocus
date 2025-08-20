'use client';

import Link from 'next/link';

export type Crumb = { name: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {c.href ? (
              <Link href={c.href} className="hover:underline text-gray-700">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-gray-900 font-medium">
                {c.name}
              </span>
            )}
            {i < items.length - 1 && <span className="text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
