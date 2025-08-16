'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/storeTypes';

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
          {pageSlice.map((p) => (
            <article key={p.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src={p.img} alt={p.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold leading-tight">{p.title}</h3>
                {p.year ? <div className="mt-1 text-sm text-gray-600">{p.year}</div> : null}
                <div className="mt-2 text-emerald-700 font-bold">${p.price.toLocaleString()}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(p.id)}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Add
                  </button>
                  <Link
                    href={`/reports/${p.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

