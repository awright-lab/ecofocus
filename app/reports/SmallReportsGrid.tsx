'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/storeTypes';
import { ArrowRight, BadgeDollarSign, FileBarChart, Layers } from 'lucide-react';

type Props = {
  pageSlice: Product[];
  addToCart: (id: string) => void;
};

export default function SmallReportsGrid({ pageSlice, addToCart }: Props) {
  return (
    <section id="reports" className="container mx-auto px-4 py-10">
      {pageSlice.length === 0 ? (
        <p className="text-gray-600">No small reports match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageSlice.map((p) => {
            // Guard year display
            const yearLabel = typeof (p as any).year !== 'undefined' && (p as any).year !== null
              ? String((p as any).year)
              : undefined;

            return (
              <article
                key={p.id}
                className="group relative rounded-2xl border bg-white/90 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Subtle gradient ring on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-emerald-500/30" />

                {/* Media */}
                <div className="relative aspect-[16/9]">
                  {yearLabel && (
                    <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
                      {yearLabel}
                    </span>
                  )}

                  {p.img ? (
                    <>
                      <Image src={p.img} alt={p.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-black/0 to-black/0" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="h-10 w-40 animate-pulse rounded-full bg-gray-300/70" />
                    </div>
                  )}

                  {/* Floating price pill */}
                  <div className="absolute -bottom-4 left-4 z-20">
                    <div className="rounded-xl bg-white shadow-md border px-4 py-2">
                      <span className="text-[11px] text-gray-500">Report</span>
                      <div className="text-lg font-bold text-emerald-700 leading-5">
                        ${p.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 pt-7">
                  <h3 className="text-base font-semibold leading-tight">{p.title}</h3>

                  {/* Tiny density strip (static, no new fields required) */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-gray-700">
                      <FileBarChart className="h-3.5 w-3.5" />
                      Slide-ready
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-gray-700">
                      <Layers className="h-3.5 w-3.5" />
                      PDF + PPTX
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(p.id)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
                    >
                      Add
                      <BadgeDollarSign className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/reports/${p.id}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                    >
                      Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}


