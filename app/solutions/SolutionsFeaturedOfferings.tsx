// app/solutions/SolutionsFeaturedOfferings.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CATALOG, BUNDLES } from '@/lib/catalog'; // keep this path consistent with your project
import type { Product } from '@/lib/storeTypes'; // adjust path if your types live elsewhere
import { BadgeCheck } from 'lucide-react';

type Props = {
  /** Prefer passing explicit products. If omitted, we show Bundles from the catalog. */
  products?: Product[];
  /** Back-compat if parent was passing 'items' */
  items?: Product[];
  title?: string;
  eyebrow?: string;
  /** Fallback image used when item.img is missing */
  fallbackImageSrc?: string;
};

function primaryHref(p: Product): string {
  // Route users according to access model and category
  switch (p.accessModel) {
    case 'paid-direct':
      return `/store/${p.id}`;
    case 'paid-contact':
      return p.contactPath || '/contact';
    case 'free-gated':
    case 'free-open':
    default:
      // For free or report-like items, send to report details if it's a report
      return p.category === 'Reports' ? `/reports/${p.id}` : `/store/${p.id}`;
  }
}

export default function SolutionsFeaturedOfferings({
  products,
  items,
  title = 'Featured Offerings',
  eyebrow = 'Solutions',
  fallbackImageSrc = '/images/report-cover-fallback.jpg',
}: Props) {
  // Choose data source in priority order: props.products → props.items → Bundles
  const list: Product[] = (products ?? items ?? BUNDLES).filter(Boolean);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-3">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="text-black/60">{eyebrow}</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Packages and reports that help teams move from insight to action.
        </p>

        {/* Cards */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => {
            // ✅ Guarantee a concrete string for Next/Image
            const imgSrc: string = p.img ?? fallbackImageSrc;
            const href = primaryHref(p);

            return (
              <Link
                key={p.id}
                href={href}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-300 transition"
              >
                {/* Top media */}
                <div className="relative aspect-[16/9]">
                  <Image
                    src={imgSrc}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(min-width:1024px) 33vw, 92vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
                  {/* Optional badge */}
                  {p.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-900 shadow">
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{p.title}</h3>
                  </div>

                  {p.subtitle && (
                    <p className="mt-1.5 text-sm text-gray-700 line-clamp-2">{p.subtitle}</p>
                  )}

                  {/* Meta row */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                    {typeof p.year === 'number' && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">{p.year}</span>
                    )}
                    {Array.isArray(p.tags) && p.tags.slice(0, 2).map((t) => (
                      <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto text-emerald-700 font-semibold group-hover:underline">
                      Learn more →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


