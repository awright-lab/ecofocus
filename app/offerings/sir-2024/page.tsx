'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CATALOG } from '@/lib/catalog';
import { startCheckout } from '@/lib/checkout';

export default function Sir2024Page() {
  const product = CATALOG.find(p => p.id === 'sir-2024');
  if (!product) {
    return (
      <main>
        <Header />
        <section className="container mx-auto px-4 py-16">Offering not found.</section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white">
      <Header />

      {/* Hero header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-marigold-50" />
        <div className="container mx-auto px-4 pt-16 pb-10">
          <div className="h-1.5 w-32 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-yellow-400" />
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {product.title}
          </h1>
          {product.subtitle && (
            <p className="mt-2 max-w-3xl text-gray-700">
              {product.subtitle}
            </p>
          )}

          {/* Meta chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-gray-700">
              Report • PDF + charts
            </span>
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-gray-700">
              Read‑only dashboard seats included
            </span>
            {product.badge && (
              <span className="inline-flex items-center rounded-full bg-emerald-600 text-white px-3 py-1">
                {product.badge}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main content + sticky purchase card */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          {/* Left: content */}
          <div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border bg-white">
              <Image
                src={product.img}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* What’s inside */}
            {product.includes?.length ? (
              <div className="mt-10">
                <h2 className="text-lg font-semibold">What’s inside</h2>
                <ul className="mt-3 grid gap-2 text-sm text-gray-800">
                  {product.includes.map(x => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Key takeaways */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold">Key takeaways</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-4 bg-white">
                  <h3 className="font-semibold text-gray-900">Purchase drivers</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    Understand how sustainability priorities influence consideration,
                    trial, and retention across demographics and cohorts.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 bg-white">
                  <h3 className="font-semibold text-gray-900">Packaging & trust</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    See how eco‑friendly packaging and recyclability shape brand
                    perception and loyalty.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 bg-white">
                  <h3 className="font-semibold text-gray-900">Recycling realities</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    Pinpoint barriers and opportunities for policy, product, and messaging.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 bg-white">
                  <h3 className="font-semibold text-gray-900">Affordability lens</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    Balance value perceptions with pricing to reduce friction for
                    sustainable choices.
                  </p>
                </div>
              </div>
            </div>

            {/* Sample pages / preview CTA */}
            <div className="mt-10 rounded-2xl border bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Preview the material</h2>
                  <p className="text-sm text-gray-700">
                    Request sample pages and a quick walkthrough of the analysis.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                  Request sample pages
                </Link>
              </div>
            </div>

            {/* Methodology / dashboard */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5">
                <h2 className="text-lg font-semibold">Methodology snapshot</h2>
                <ul className="mt-3 grid gap-2 text-sm text-gray-800">
                  <li>• Nationally representative U.S. adults (18+)</li>
                  <li>• Balanced to U.S. Census benchmarks</li>
                  <li>• Quantitative survey; robust sample size</li>
                  <li>• Detailed demographic and cohort breakouts</li>
                </ul>
              </div>
              <div className="rounded-2xl border bg-white p-5">
                <h2 className="text-lg font-semibold">Interactive dashboard access</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Eligible purchases include read‑only dashboard seats to explore
                  charts by topic, cohort, and year.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Schedule a quick tour
                </Link>
              </div>
            </div>

            {/* FAQ (simple details/summary for zero‑JS) */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold">FAQs</h2>
              <div className="mt-3 space-y-3">
                <details className="rounded-2xl border bg-white p-4">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    What file formats do I receive?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    You’ll receive a PDF report and a slide‑ready charts pack.
                  </p>
                </details>
                <details className="rounded-2xl border bg-white p-4">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    How many team members can access?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    The report is licensed to your org; read‑only dashboard seats are included.
                  </p>
                </details>
                <details className="rounded-2xl border bg-white p-4">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    Can I add custom cuts or analysis?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Yes—contact us for an add‑on analysis or to bundle with custom research.
                  </p>
                </details>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 rounded-2xl border bg-gradient-to-br from-emerald-50 to-yellow-50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Ready to equip your team?</h2>
                  <p className="text-sm text-gray-700">
                    Get the full report now or request a brief demo of key sections.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startCheckout([{ id: product.id, qty: 1 }], { offering: 'sir-2024' })}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Buy now — ${product.price.toLocaleString()}
                  </button>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white/50"
                  >
                    Request a demo
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right: purchase card */}
          <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
            <div className="text-sm text-gray-500">Report</div>
            <div className="mt-1 text-2xl font-bold text-emerald-700">
              ${product.price.toLocaleString()}
            </div>
            <button
              onClick={() => startCheckout([{ id: product.id, qty: 1 }], { offering: 'sir-2024' })}
              className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700"
            >
              Buy now
            </button>
            <Link
              href="/contact"
              className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
            >
              Request sample pages
            </Link>
            {product.badge && (
              <div className="mt-3 inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-900 border border-yellow-100">
                {product.badge}
              </div>
            )}

            {/* Small trust strip */}
            <div className="mt-5 grid gap-2 text-xs text-gray-600">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Secure checkout via Stripe
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Organization‑wide usage license (per SOW)
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}

