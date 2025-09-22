'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { startCheckout } from '@/lib/checkout';
import {
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight
} from 'lucide-react';

// Minimal product shape (matches your CATALOG items for small reports)
type SmallReport = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  img: string;
  category: 'Reports';
  year?: number;
  tags?: string[];
  includes?: string[];
};

export default function ReportDetailClient({
  product,
  related = [],
}: {
  product: SmallReport;
  related?: SmallReport[];
}) {
  return (
    <>
      {/* HERO (light, branded) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40">
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {product.title}
          </h1>
          {product.subtitle && (
            <p className="mt-2 max-w-3xl text-gray-700">
              {product.subtitle}
            </p>
          )}

          {/* little meta chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {product.year && (
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-gray-700">
                Year {product.year}
              </span>
            )}
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-gray-700">
              PDF + Charts pack
            </span>
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-gray-700">
              Licensed for internal use
            </span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          {/* LEFT: Content */}
          <div>
            {/* Media */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-white"
            >
              <Image
                src={product.img}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </motion.div>

            {/* What’s included */}
            {product.includes?.length ? (
              <div className="mt-10">
                <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
                <h2 className="mt-3 text-xl font-semibold">What’s included</h2>
                <ul className="mt-4 grid gap-2 text-sm text-gray-800">
                  {product.includes.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* How this helps / use-cases */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
              <h2 className="mt-3 text-xl font-semibold">How teams use this</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    h: 'Quick executive briefings',
                    p: 'Drop slide‑ready charts and crisp takeaways into your next deck.',
                  },
                  {
                    h: 'Category planning',
                    p: 'Use focused insights to support claims, packaging moves, and channel conversations.',
                  },
                  {
                    h: 'Message calibration',
                    p: 'Validate proof points around recycling, responsibility, and value—by audience.',
                  },
                  {
                    h: 'Fast cohort readouts',
                    p: 'See how results vary for Gen Z, Millennials, and parents.',
                  },
                ].map((c) => (
                  <div key={c.h} className="rounded-xl border p-4 hover:shadow-sm transition-shadow">
                    <div className="font-semibold">{c.h}</div>
                    <p className="mt-1 text-sm text-gray-700">{c.p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
              <h2 className="mt-3 text-xl font-semibold">FAQ</h2>

              <div className="mt-4 space-y-3">
                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    What formats do I receive?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    A focused PDF section and a slide‑ready charts pack for easy internal sharing.
                  </p>
                </details>
                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    Do you offer deeper cuts or add‑ons?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Yes—ask about custom analyses or bundling with the full report or dashboard access.
                  </p>
                </details>
              </div>
            </div>

            {/* Related reports */}
            {related.length > 0 && (
              <div className="mt-12">
                <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
                <h2 className="mt-3 text-xl font-semibold">Related small reports</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/reports/${r.id}`}
                      className="group rounded-2xl border overflow-hidden hover:shadow-sm transition-shadow bg-white"
                    >
                      <div className="relative aspect-[16/9]">
                        <Image src={r.img} alt={r.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-semibold leading-tight group-hover:underline">
                          {r.title}
                        </div>
                        {r.year && <div className="mt-1 text-xs text-gray-600">{r.year}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sticky purchase card */}
          <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
            <div className="text-sm text-gray-500">Small Report</div>
            <div className="mt-1 text-2xl font-bold text-emerald-700">
              ${product.price.toLocaleString()}
            </div>

            <button
              onClick={() => startCheckout([{ id: product.id, qty: 1 }], { detail: 'small-report' })}
              className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700"
            >
              Buy now
            </button>

            <Link
              href="/contact"
              className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
            >
              Ask about bundling
            </Link>

            {/* Trust strip */}
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                Secure checkout via Stripe
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                Invoice & receipt emailed instantly
              </li>
            </ul>

            {/* Quick highlights (echo includes if present) */}
            {product.includes?.length ? (
              <div className="mt-5 border-t pt-4">
                <div className="text-sm font-semibold">Quick highlights</div>
                <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                  {product.includes.slice(0, 3).map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* METRICS STRIP (consistent with other pages) */}
      <section className="border-t bg-white">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            <div className="rounded-2xl border p-6">
              <div className="text-3xl font-bold text-emerald-700">4,000</div>
              <div className="text-sm text-gray-600">US adults (balanced to Census)</div>
            </div>
            <div className="rounded-2xl border p-6">
              <div className="text-3xl font-bold text-emerald-700">90,000+</div>
              <div className="text-sm text-gray-600">Data points available</div>
            </div>
            <div className="rounded-2xl border p-6">
              <div className="text-3xl font-bold text-emerald-700">±1.55%</div>
              <div className="text-sm text-gray-600">Margin of error</div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-400 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Want multiple sections or years?
          </h2>
          <p className="mt-2 text-white/90">
            Bundle small reports or add dashboard access for deeper exploration.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => startCheckout([{ id: product.id, qty: 1 }], { detail: 'small-report' })}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-gray-100"
            >
              Buy this report
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Talk about a bundle
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
