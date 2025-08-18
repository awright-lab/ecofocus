'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CATALOG } from '@/lib/catalog';
import { startCheckout } from '@/lib/checkout';

export default function Enhance2024Page() {
  const product = CATALOG.find(p => p.id === 'enhance-2024');
  if (!product) return <div className="container mx-auto px-4 py-16">Offering not found.</div>;

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-6 max-w-3xl">
        <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
        <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">{product.title}</h1>
        {product.subtitle && <p className="mt-2 text-gray-700">{product.subtitle}</p>}
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
        {/* Left: content */}
        <div>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border bg-white">
            <Image src={product.img} alt={product.title} fill className="object-cover" />
          </div>

          {product.includes?.length ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">What’s included</h2>
              <ul className="mt-3 grid gap-2 text-sm text-gray-800">
                {product.includes.map(x => <li key={x}>• {x}</li>)}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 grid gap-3 text-sm text-gray-700">
            <p>
              Infuse your existing datasets with EcoFocus’ validated sustainability signals to unlock
              deeper segmentation and more actionable personas. We align schemas, deliver matched
              crosstabs, and provide dashboard access so your team can slice by year, cohort, and topic.
            </p>
          </div>
        </div>

        {/* Right: purchase card */}
        <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
          <div className="text-sm text-gray-500">Service</div>
          <div className="mt-1 text-2xl font-bold text-emerald-700">
            ${product.price.toLocaleString()}
          </div>
          <button
            onClick={() => startCheckout([{ id: product.id, qty: 1 }], { offering: 'enhance-2024' })}
            className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700"
          >
            Buy now
          </button>
          <Link
            href="/contact"
            className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
          >
            Talk to an expert
          </Link>
          {product.badge && (
            <div className="mt-3 inline-flex rounded-full bg-marigold-50 px-3 py-1 text-xs font-semibold text-marigold-800 border border-marigold-100">
              {product.badge}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
