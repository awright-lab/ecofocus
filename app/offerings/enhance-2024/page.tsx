'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CATALOG } from '@/lib/catalog';
import { startCheckout } from '@/lib/checkout';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import {
  ShieldCheck,
  BarChart2,
  LineChart,
  Users,
  BadgeCheck,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function Enhance2024Page() {
  const product = CATALOG.find((p) => p.id === 'enhance-2024');
  if (!product) {
    return (
      <main>
        <Header />
        <section className="container mx-auto px-4 py-16">
          Offering not found.
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white">
        {/* accent grid */}
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="container mx-auto px-6 py-16 md:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Service Offering
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            {product.title}
          </h1>

          {product.subtitle && (
            <p className="mt-3 max-w-3xl text-white/80 text-base md:text-lg">
              {product.subtitle}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <Users className="h-4 w-4" />
              Cohort-ready matching
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <BarChart2 className="h-4 w-4" />
              Crosstabs aligned to your schema
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <LineChart className="h-4 w-4" />
              Dashboard access included
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
                <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
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

            {/* How it works */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">How it works</h2>

              <ol className="mt-4 grid gap-4">
                {[
                  {
                    t: 'Discovery & scoping',
                    d: 'Share your data structure, use-cases, and decision needs. We align on target audiences, variables, and outcomes.',
                  },
                  {
                    t: 'Schema alignment',
                    d: 'We map EcoFocus sustainability signals to your fields and build crosstabs that plug into your workflows.',
                  },
                  {
                    t: 'Enrichment & QA',
                    d: 'We enrich your dataset with validated signals and run QA to ensure consistency and comparability across cohorts.',
                  },
                  {
                    t: 'Delivery & enablement',
                    d: 'Receive matched crosstabs, documentation, and dashboard access with onboarding to accelerate adoption.',
                  },
                ].map((s, idx) => (
                  <li
                    key={s.t}
                    className="rounded-xl border p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{s.t}</div>
                        <p className="text-sm text-gray-700">{s.d}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Use cases */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">Great for</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    h: 'Segmentation refresh',
                    p: 'Strengthen personas with sustainability attitudes, packaging expectations, and cohort differences.',
                  },
                  {
                    h: 'Road‑map & portfolio',
                    p: 'Prioritize features and claims that resonate with eco‑conscious consumers without sacrificing value.',
                  },
                  {
                    h: 'Message testing',
                    p: 'Calibrate claims and proofs around recyclability, corporate responsibility, and affordability tradeoffs.',
                  },
                  {
                    h: 'Retail & channel',
                    p: 'Arm sales with category‑specific signals that support line reviews and shelf communications.',
                  },
                ].map((c) => (
                  <div
                    key={c.h}
                    className="rounded-xl border p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="font-semibold">{c.h}</div>
                    <p className="mt-1 text-sm text-gray-700">{c.p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">FAQ</h2>

              <div className="mt-4 space-y-3">
                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    How long does implementation take?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Typical engagements are 2–4 weeks depending on schema complexity and the number of matched
                    variables. We’ll confirm a timeline after discovery.
                  </p>
                </details>

                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    Can we blend multiple internal datasets?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Yes. We frequently align syndicated signals to multiple sources (e.g., brand tracker + CRM + panel),
                    then deliver unified crosstabs for consistent analysis.
                  </p>
                </details>

                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    What access is included?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    License includes dashboard access (per your agreement), onboarding sessions, and documentation to
                    keep teams self‑sufficient.
                  </p>
                </details>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 rounded-2xl border bg-gradient-to-br from-emerald-50 to-white p-6">
              <div className="text-sm uppercase tracking-wide text-emerald-700 font-semibold">
                Client Spotlight
              </div>
              <blockquote className="mt-2 text-gray-800">
                “Blending EcoFocus signals into our tracker unlocked the ‘why’ behind shifts we were seeing. The enablement
                and crosstabs made it easy for brand and insights teams to use immediately.”
              </blockquote>
              <div className="mt-3 text-sm text-gray-600">VP, Consumer Insights — CPG</div>
            </div>
          </div>

          {/* RIGHT: Sticky purchase card */}
          <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
            <div className="text-xs font-semibold text-emerald-700/80 inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4" />
              Licensed Service
            </div>

            <div className="mt-2 text-2xl font-bold text-emerald-700">
              ${product.price.toLocaleString()}
            </div>

            <button
              onClick={() =>
                startCheckout([{ id: product.id, qty: 1 }], { offering: 'enhance-2024' })
              }
              className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              Buy now
            </button>

            <Link
              href="/contact"
              className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
            >
              Talk to an expert
            </Link>

            {/* Trust & notes */}
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

            {product.badge && (
              <div className="mt-4 inline-flex rounded-full bg-marigold-50 px-3 py-1 text-xs font-semibold text-marigold-800 border border-marigold-100">
                {product.badge}
              </div>
            )}

            {/* Mini feature list (pulls from product.includes if present) */}
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

      {/* METRICS STRIP */}
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
      <section className="py-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-marigold-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to elevate your data with sustainability signals?
          </h2>
          <p className="mt-2 text-white/90">
            Blend EcoFocus into your existing datasets and make decisions with confidence.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() =>
                startCheckout([{ id: product.id, qty: 1 }], { offering: 'enhance-2024' })
              }
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-gray-100"
            >
              Purchase Enhance 2024
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Schedule a discovery call
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
