// components/reports/ReportCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ReportCardModel } from '@/types/reportModels';

export default function ReportCard({
  r,
  onFreeDownload,
  onContact,
}: {
  r: ReportCardModel;
  onFreeDownload?: (r: ReportCardModel) => void;
  onContact?: (r: ReportCardModel) => void;
}) {
  const isFree = r.badge === 'Free';
  const isDirectPaid = r.badge === 'Paid' && r.purchaseType === 'direct' && !!r.href;
  const isContact = r.badge === 'Paid' && r.purchaseType === 'contact';

  return (
    <article
      className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:border-emerald-300 hover:shadow-md transition"
      aria-label={r.title}
    >
      {/* Cover */}
      <div className="relative aspect-[16/9]">
        <Image
          src={r.cover || '/images/report-cover-fallback.jpg'}
          alt={r.title}
          fill
          sizes="(min-width:1024px) 33vw, 92vw"
          className="object-cover"
          priority={false}
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${
            isFree ? 'bg-emerald-600' : 'bg-amber-600'
          }`}
        >
          {r.badge}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{r.title}</h3>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3">{r.excerpt}</p>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          {r.topic && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5" aria-label={`Topic: ${r.topic}`}>
              {r.topic}
            </span>
          )}
          {r.category && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5" aria-label={`Category: ${r.category}`}>
              {r.category}
            </span>
          )}
          <span className="ml-auto" aria-label={`Year: ${r.year}`}>
            {r.year}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-5">
          {isFree && (
            <button
              type="button"
              onClick={() => onFreeDownload?.(r)}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Get Free Download
            </button>
          )}

          {isDirectPaid && (
            <Link
              href={r.href!}
              className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-4 py-2 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              aria-label={`Buy ${r.title}${typeof r.price === 'number' ? ` for $${r.price.toLocaleString()}` : ''}`}
            >
              Buy Report
              {typeof r.price === 'number' ? ` · $${r.price.toLocaleString()}` : ''}
            </Link>
          )}

          {isContact && (
            <button
              type="button"
              onClick={() => onContact?.(r)}
              className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-4 py-2 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Contact for Pricing
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

