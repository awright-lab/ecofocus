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
  BadgeCheck,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  CalendarCheck2,
  FlaskConical,
} from 'lucide-react';

export default function BuyIn2025Page() {
  const product = CATALOG.find((p) => p.id === 'buyin-2025');
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
            Study Participation
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
              <ClipboardList className="h-4 w-4" />
              Your custom questions included
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <BarChart2 className="h-4 w-4" />
              Executive report + crosstabs
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <LineChart className="h-4 w-4" />
              Dashboard access for your team
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
              {product.badge && (
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
                  {product.badge}
                </span>
              )}
            </motion.div>

            {/* What you get */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">What’s included</h2>
              <ul className="mt-4 grid gap-2 text-sm text-gray-800">
                {[
                  'Your proprietary questions fielded in the 2025 study',
                  'Custom research report with executive summary, insights, and key takeaways',
                  'Crosstabs per SOW (aligned to your audiences and KPIs)',
                  'Interactive dashboard access for your team (seats scale by org size)',
                  'Enablement & onboarding sessions to accelerate internal adoption',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">Timeline at a glance</h2>

              <ol className="mt-4 grid gap-4">
                {[
                  {
                    t: 'Scoping & question design',
                    d: 'We refine your objectives and finalize the custom questions and cohorts.',
                    icon: ClipboardList,
                  },
                  {
                    t: 'Fieldwork & quality checks',
                    d: 'We field the annual study and apply rigorous QA across demographics and cohorts.',
                    icon: FlaskConical,
                  },
                  {
                    t: 'Analysis & deliverables',
                    d: 'You receive the custom report, crosstabs, and dashboard access with onboarding.',
                    icon: BarChart2,
                  },
                  {
                    t: 'Enablement & follow‑ups',
                    d: 'We support your team post‑delivery with readouts and usage guidance.',
                    icon: CalendarCheck2,
                  },
                ].map((s, idx) => (
                  <li
                    key={s.t}
                    className="rounded-xl border p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{idx + 1}. {s.t}</div>
                        <p className="text-sm text-gray-700">{s.d}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Participation options */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">Participation options</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4 hover:shadow-sm transition-shadow">
                  <div className="font-semibold">Standard Buy‑In</div>
                  <p className="mt-1 text-sm text-gray-700">
                    Place proprietary questions in the 2025 wave and receive the full suite of deliverables
                    (report, crosstabs, dashboard access, onboarding).
                  </p>
                </div>
                <div className="rounded-xl border p-4 hover:shadow-sm transition-shadow">
                  <div className="font-semibold">Mini Insights Option</div>
                  <p className="mt-1 text-sm text-gray-700">
                    Limited free placement for brand‑level reads (availability permitting). Receive a concise
                    custom readout post‑field. Great for an initial signal check.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">FAQ</h2>

              <div className="mt-4 space-y-3">
                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    How many custom questions can we include?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    We’ll scope question count and formats during discovery to balance study length and data quality,
                    then confirm in the SOW.
                  </p>
                </details>

                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    What audiences can we analyze?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    We support gen pop with key cohorts (e.g., parents, Gen Z/Millennials) and can target additional
                    screening where appropriate.
                  </p>
                </details>

                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    What access is included?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    You’ll receive the custom report, agreed crosstabs, and dashboard seats (seat count scales by org size),
                    plus onboarding and enablement.
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
                “Adding our questions to the syndicated study gave us fast, defensible reads with rich context.
                The resulting story was immediately usable in planning and sales.”
              </blockquote>
              <div className="mt-3 text-sm text-gray-600">SVP, Insights — Food & Bev</div>
            </div>
          </div>

          {/* RIGHT: Sticky purchase card */}
          <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
            <div className="text-xs font-semibold text-emerald-700/80 inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4" />
              Study Participation
            </div>

            <div className="mt-2 text-2xl font-bold text-emerald-700">
              ${product.price.toLocaleString()}
            </div>

            <button
              onClick={() =>
                startCheckout([{ id: product.id, qty: 1 }], { offering: 'buyin-2025' })
              }
              className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              Buy now
            </button>

            <Link
              href="/contact"
              className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
            >
              Schedule a discovery call
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

            {/* Mini feature list (quick highlights) */}
            <div className="mt-5 border-t pt-4">
              <div className="text-sm font-semibold">Quick highlights</div>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                {[
                  'Custom questions in 2025 study',
                  'Executive report + crosstabs',
                  'Dashboard seats included',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* METRICS STRIP (keep consistent with Enhance page) */}
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
            Ready to place your questions in the 2025 study?
          </h2>
          <p className="mt-2 text-white/90">
            Get defensible reads with rich context — report, crosstabs, and dashboard access included.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() =>
                startCheckout([{ id: product.id, qty: 1 }], { offering: 'buyin-2025' })
              }
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-gray-100"
            >
              Purchase Buy‑In
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

