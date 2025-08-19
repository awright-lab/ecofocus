'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CATALOG } from '@/lib/catalog';
import { startCheckout } from '@/lib/checkout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  BarChart2,
  Users,
  ShieldCheck,
  CircleDollarSign,
  LineChart,
  BookOpenText,
  Target,
  CheckCircle2,
} from 'lucide-react';

export default function Sir2024Page() {
  const product = CATALOG.find(p => p.id === 'sir-2024');

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

      {/* Intro Header */}
      <section className="container mx-auto px-4 pt-10 pb-6">
        <div className="max-w-3xl">
          <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-[#FFC244]" />
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            {product.title}
          </h1>
          {product.subtitle && (
            <p className="mt-3 text-gray-700">
              {product.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Top block: media + sticky purchase */}
      <section className="container mx-auto px-4 pb-10">
        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          {/* Left: hero media + quick stats */}
          <div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-white">
              <Image src={product.img} alt={product.title} fill className="object-cover" />
              {/* soft gradient bottom overlay for legibility if you place a caption later */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-transparent pointer-events-none" />
            </div>

            {/* Key highlights strip */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border bg-white p-4 flex items-start gap-3">
                <Users className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold">4,000 US Adults</div>
                  <div className="text-gray-600">Balanced to Census; Gen Pop + grocery shoppers</div>
                </div>
              </div>
              <div className="rounded-xl border bg-white p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold">±1.55% MOE</div>
                  <div className="text-gray-600">Reliable results across cohorts</div>
                </div>
              </div>
              <div className="rounded-xl border bg-white p-4 flex items-start gap-3">
                <BarChart2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold">200+ Slide‑Ready Charts</div>
                  <div className="text-gray-600">Trendlines, crosstabs, and takeaways</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: purchase card */}
          <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
            <div className="text-sm text-gray-500">Report</div>
            <div className="mt-1 text-3xl font-bold text-emerald-700">
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
              <div className="mt-3 inline-flex rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#7A4B00] border border-[#FFE5AA]">
                {product.badge}
              </div>
            )}

            {/* What’s included */}
            {product.includes?.length ? (
              <div className="mt-6">
                <div className="text-sm font-semibold">What’s included</div>
                <ul className="mt-3 space-y-2 text-sm text-gray-800">
                  {product.includes.map(x => (
                    <li key={x} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* Content sections */}
      <section className="bg-gray-50/60 border-y">
        <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-2">
          {/* What’s inside */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-gray-700 bg-white">
              <BookOpenText className="h-4 w-4 text-emerald-600" />
              What’s inside
            </div>
            <h2 className="mt-3 text-xl font-semibold">Chapters & Focus Areas</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-800">
              <li>• The Green Mindset — consumer attitudes & behaviors</li>
              <li>• Packaging in the Spotlight — preferences & tradeoffs</li>
              <li>• Trust & Accountability — corporate & retail responsibility</li>
              <li>• The Recycling Reality — behaviors & barriers</li>
              <li>• The Price of Green — value perceptions & affordability</li>
              <li>• Knowledge is Power — environmental knowledge & info sources</li>
            </ul>
            <p className="mt-4 text-sm text-gray-700">
              Each chapter includes executive takeaways, chart decks you can drop into slides,
              and crosstab cuts by generation, parental status, and more.
            </p>
          </div>

          {/* Outcomes / who it’s for */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-gray-700 bg-white">
              <Target className="h-4 w-4 text-emerald-600" />
              Built for teams
            </div>
            <h2 className="mt-3 text-xl font-semibold">Where teams get value</h2>
            <ul className="mt-4 grid gap-3">
              <li className="rounded-xl bg-white p-4 border">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <LineChart className="h-4 w-4 text-emerald-600" />
                  Strategy & Roadmapping
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  Prioritize initiatives with trend data across demographics and cohorts.
                </p>
              </li>
              <li className="rounded-xl bg-white p-4 border">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CircleDollarSign className="h-4 w-4 text-emerald-600" />
                  Product & Packaging
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  Understand recyclability perceptions, label clarity, and willingness‑to‑pay.
                </p>
              </li>
              <li className="rounded-xl bg-white p-4 border">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Reputation & Risk
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  Track expectations for corporate commitments and reputation drivers.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Callout band */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#FFC244]" />
        <div className="container mx-auto px-4 py-10 text-white">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold">Slide‑ready, decision‑ready.</h3>
            <p className="mt-2 text-white/90">
              Get immediate value with mapped crosstabs and a clean chart pack you can share
              internally. Optional dashboard seats let your team explore 24/7.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => startCheckout([{ id: product.id, qty: 1 }], { offering: 'sir-2024' })}
              className="rounded-full bg-white text-emerald-700 px-5 py-2.5 font-semibold hover:bg-white/90"
            >
              Purchase the report
            </button>
            <Link
              href="/contact"
              className="rounded-full border border-white/70 px-5 py-2.5 font-semibold hover:bg-white/10"
            >
              Ask about dashboard access
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs (simple details) */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold">Frequently asked</h2>
        <div className="mt-5 grid gap-4">
          <details className="group rounded-xl border p-4 open:shadow-sm">
            <summary className="cursor-pointer font-semibold list-none">
              How is the data collected?
            </summary>
            <p className="mt-2 text-sm text-gray-700">
              Online survey, ~20–25 minutes, with quotas balanced to the US Census for representativeness.
            </p>
          </details>
          <details className="group rounded-xl border p-4 open:shadow-sm">
            <summary className="cursor-pointer font-semibold list-none">
              Can we get a sample before purchasing?
            </summary>
            <p className="mt-2 text-sm text-gray-700">
              Yes—use “Request sample pages” and our team will share a short preview deck.
            </p>
          </details>
          <details className="group rounded-xl border p-4 open:shadow-sm">
            <summary className="cursor-pointer font-semibold list-none">
              Do you offer cohort‑specific deep dives?
            </summary>
            <p className="mt-2 text-sm text-gray-700">
              Yes. We can provide custom cuts by generation, parents, and additional profiles upon request.
            </p>
          </details>
        </div>
      </section>

      {/* Related nav */}
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl border p-6">
          <div className="text-sm font-semibold text-gray-900">You might also be interested in</div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/reports/enhance-2024"
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Enhance Your Data — 2024
            </Link>
            <Link
              href="/reports/buyin-2025"
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              2025 Syndicated Study — Buy‑In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

