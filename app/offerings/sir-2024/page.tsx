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

export default function Sir2024Page() {
  const product = CATALOG.find((p) => p.id === 'sir-2024');

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

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white">
        {/* subtle grid */}
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="container mx-auto px-6 py-16 md:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Report Offering
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            {product.title}
          </h1>

          {product.subtitle && (
            <p className="mt-3 max-w-3xl text-white/80 text-base md:text-lg">
              {product.subtitle}
            </p>
          )}

          {/* quick chips */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <BarChart2 className="h-4 w-4" />
              200+ charts & takeaways
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <Users className="h-4 w-4" />
              Gen Pop + cohort cuts
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <LineChart className="h-4 w-4" />
              Dashboard seats included*
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

            {/* What’s inside */}
            {product.includes?.length ? (
              <div className="mt-10">
                <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
                <h2 className="mt-3 text-xl font-semibold">What’s inside</h2>
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

            {/* Executive summary */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">Executive summary</h2>
              <div className="mt-4 grid gap-3 text-sm text-gray-700">
                <p>
                  Data‑driven insights on how environmental attitudes influence purchasing, brand trust,
                  and reputational risk. Demographic cuts, cohort analysis, and packaging/recycling
                  deep dives help teams prioritize roadmaps and messaging.
                </p>
                <p>
                  The report highlights cohort differences (Gen Z, Millennials, Parents), the role of
                  packaging and recyclability in trust and choice, and affordability tradeoffs that
                  shape sustainable adoption.
                </p>
              </div>
            </div>

            {/* How it helps */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">How teams use this</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    h: 'Strategy & portfolios',
                    p: 'Quantify where sustainability changes behavior; prioritize features and claims with the highest lift.',
                  },
                  {
                    h: 'Message & claims',
                    p: 'Calibrate proof points around recyclability, responsibility, and value—by audience.',
                  },
                  {
                    h: 'Retail & channel',
                    p: 'Support line reviews with category‑specific signals and expected packaging outcomes.',
                  },
                  {
                    h: 'Risk & reputation',
                    p: 'Track expectations for corporate responsibility to protect brand trust.',
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
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">FAQ</h2>

              <div className="mt-4 space-y-3">
                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    What access is included with this report?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Your purchase includes the full report (PDF + charts) and read‑only dashboard seats
                    for exploration and internal sharing.*
                  </p>
                </details>

                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    Can we get sample pages before purchase?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Yes—use “Request sample pages” to contact our team. We’ll share representative
                    visuals and the table of contents.
                  </p>
                </details>

                <details className="group rounded-xl border p-4">
                  <summary className="cursor-pointer list-none font-semibold">
                    How current is the data?
                  </summary>
                  <p className="mt-2 text-sm text-gray-700">
                    The 2024 study includes 4,000 US adults (balanced to Census) with a ±1.55% MOE.
                  </p>
                </details>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                *Dashboard seat counts may vary by license agreement.
              </p>
            </div>

            {/* Testimonial */}
            <div className="mt-12 rounded-2xl border bg-gradient-to-br from-emerald-50 to-white p-6">
              <div className="text-sm uppercase tracking-wide text-emerald-700 font-semibold">
                Client Spotlight
              </div>
              <blockquote className="mt-2 text-gray-800">
                “The SIR gave our leadership a clear view of what actually drives adoption. The cuts by
                cohort and packaging expectations sharpened both roadmap and comms.”
              </blockquote>
              <div className="mt-3 text-sm text-gray-600">SVP, Strategy — CPG</div>
            </div>
          </div>

          {/* RIGHT: Sticky purchase card */}
          <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
            <div className="text-xs font-semibold text-emerald-700/80 inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4" />
              Report License
            </div>

            <div className="mt-2 text-2xl font-bold text-emerald-700">
              ${product.price.toLocaleString()}
            </div>

            <button
              onClick={() => startCheckout([{ id: product.id, qty: 1 }], { offering: 'sir-2024' })}
              className="mt-4 w-full rounded-full bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              Buy now
            </button>

            <Link
              href="/contact"
              className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
            >
              Request sample pages
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

            {/* Mini feature list */}
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
            Ready to put sustainability signals to work?
          </h2>
          <p className="mt-2 text-white/90">
            Equip your team with the 2024 Sustainability Insights Report and dashboard access.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => startCheckout([{ id: product.id, qty: 1 }], { offering: 'sir-2024' })}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-gray-100"
            >
              Purchase SIR 2024
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Request sample pages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


