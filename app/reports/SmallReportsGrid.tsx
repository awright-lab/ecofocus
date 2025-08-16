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
    <section id="reports" className="container mx-auto px-4 py-8">
      {pageSlice.length === 0 ? (
        <p className="text-gray-600">No small reports match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {pageSlice.map((p) => {
            const yearLabel =
              (p as any).year !== undefined && (p as any).year !== null
                ? String((p as any).year)
                : undefined;

            return (
              <article
                key={p.id}
                className="group relative rounded-xl border bg-white/90 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden transition-shadow hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              >
                {/* Media (shorter) */}
                <div className="relative aspect-[16/10]">
                  {yearLabel && (
                    <span className="absolute left-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow">
                      {yearLabel}
                    </span>
                  )}

                  {p.img ? (
                    <>
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        className="object-cover saturate-[.85] group-hover:saturate-100 transition"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="h-8 w-32 animate-pulse rounded-full bg-gray-300/70" />
                    </div>
                  )}

                  {/* Smaller price pill */}
                  <div className="absolute -bottom-3 left-3 z-20">
                    <div className="rounded-lg bg-white shadow border px-3 py-1.5">
                      <span className="text-[10px] text-gray-500">Report</span>
                      <div className="text-base font-bold text-emerald-700 leading-4">
                        ${p.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body (compact) */}
                <div className="p-3 pt-6">
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2">{p.title}</h3>

                  {/* Compact chip strip (hidden on mobile to save space) */}
                  <div className="mt-1 hidden sm:flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-gray-700">
                      <FileBarChart className="h-3 w-3" />
                      Slide-ready
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-gray-700">
                      <Layers className="h-3 w-3" />
                      PDF+PPTX
                    </span>
                  </div>

                  {/* CTAs (smaller) */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <button
                      onClick={() => addToCart(p.id)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
                    >
                      Add
                      <BadgeDollarSign className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/reports/${p.id}`}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold text-gray-900 transition-colors hover:bg-gray-50"
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


