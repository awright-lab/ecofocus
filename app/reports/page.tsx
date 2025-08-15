'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Info, ShieldCheck, Sparkles, BarChart3, Clock, Users } from 'lucide-react';

/**
 * Reports & Store page for EcoFocus Research
 * - Hero w/ concise value prop
 * - Featured Report (Sustainability Insights Report)
 * - Dashboard Subscription pricing w/ Monthly / Annual toggle + NPO 20% note
 * - 2025 Syndicated Study CTA + Mini Insights Option
 * - Store Grid (placeholders for one-off products)
 * - FAQ (methodology + common questions)
 * - Talk to Us CTA
 *
 * Notes:
 * - Replace placeholder images under /public with your real assets when ready
 * - Hook Buy buttons to Stripe or your checkout when available
 */

export default function ReportsPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  const pricing = useMemo(() => {
    // values pulled from deck copy (rounded per month and annual)
    const tiers = [
      {
        name: 'Under $2M revenue',
        monthly: 2500,
        annual: 28500,
        seats: 2,
      },
      {
        name: '$2M–$10M revenue',
        monthly: 4150,
        annual: 47500,
        seats: 3,
      },
      {
        name: 'Over $10M revenue',
        monthly: 6200,
        annual: 71000,
        seats: 5,
      },
    ];
    return tiers.map((t) => ({
      ...t,
      price: billing === 'monthly' ? t.monthly : t.annual,
      priceLabel: billing === 'monthly' ? 'per month' : 'if paid annually',
      modules: [
        'All dashboard modules',
        'Two onboarding sessions',
        'Crosstab functionality',
        'Quarterly expert consultations (up to 2 hrs)',
        `${t.seats} seat licenses included`,
      ],
    }));
  }, [billing]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,#C8F5E7_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 pt-28 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl font-bold leading-tight"
              >
                Reports & Store
              </motion.h1>
              <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-700">
                Data-backed sustainability intelligence since 2010. Browse our flagship report,
                subscribe to the Interactive Dashboard, or participate in the 2025 syndicated study.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#featured-report"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow hover:shadow-md transition-shadow"
                >
                  View Featured Report <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Dashboard Pricing
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> 4,000 US adults, MoE ±1.55%</div>
                <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4"/> 90,000+ data points</div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4"/> Annual trendline since 2010</div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-gray-200 shadow">
                <Image
                  src="/images/report_cover_placeholder.webp"
                  alt="Sustainability Insights Report cover"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED REPORT */}
      <section id="featured-report" className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl font-bold">Sustainability Insights Report</h2>
            <p className="mt-3 text-gray-700">
              Strategic insights on how environmental attitudes influence purchasing behavior, brand loyalty,
              and business risk. Packed with demographic breakouts and practical implications for leaders.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-emerald-600"/> How sustainability priorities vary across demographics</li>
              <li className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-emerald-600"/> Packaging & recyclability perceptions and brand trust</li>
              <li className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-emerald-600"/> Expectations for corporate commitments & reputational risk</li>
              <li className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-emerald-600"/> Affordability barriers—and how businesses can respond</li>
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="text-2xl font-bold">$4,995</div>
              <button
                aria-label="Buy Sustainability Insights Report"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow hover:shadow-md"
                onClick={() => alert('Connect to Stripe checkout for this SKU')}
              >
                <ShoppingCart className="h-4 w-4"/> Buy now
              </button>
              <Link href="/contact" className="inline-flex items-center gap-2 text-emerald-700 hover:underline">
                <Info className="h-4 w-4"/> Request sample pages
              </Link>
            </div>
            <p className="mt-3 text-sm text-gray-600">Availability: April 1, 2025 • PDF + slide-ready charts • Site license included</p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-gray-200 shadow">
              <Image src="/images/featured_report_preview.webp" alt="Inside pages preview" fill className="object-cover"/>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PRICING */}
      <section id="pricing" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Interactive Dashboard Subscriptions</h2>
              <p className="mt-2 max-w-2xl text-gray-700">Always-on access to 90k+ validated data points with crosstabs, cohort filters, and expert onboarding.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-300 p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${billing==='monthly' ? 'bg-white shadow' : 'text-gray-600'}`}
              >Monthly</button>
              <button
                onClick={() => setBilling('annual')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${billing==='annual' ? 'bg-white shadow' : 'text-gray-600'}`}
              >Annual</button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-medium text-emerald-700">{t.name}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-3xl font-bold">{billing==='monthly' ? `$${t.price.toLocaleString()}` : `$${t.price.toLocaleString()}`}</div>
                  <div className="text-sm text-gray-600">{billing==='monthly' ? ' / mo' : ' / yr'}</div>
                </div>
                <div className="text-xs text-gray-500">{billing==='annual' ? 'Equivalent monthly savings vs monthly billing' : t.priceLabel}</div>
                <ul className="mt-5 grid gap-2 text-sm text-gray-700">
                  {t.modules.map((m) => (
                    <li key={m} className="flex items-start gap-2">
                      <svg className="mt-1 h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
                  onClick={() => alert('Connect to Stripe checkout for subscription tier')}
                >
                  Start subscription
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>Qualified not‑for‑profits: <span className="font-semibold">20% discount</span>. Additional seats available on request.</p>
          </div>

          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold text-emerald-700">Demo</div>
                <div className="text-lg md:text-xl font-bold">Take a 2‑minute tour of the Interactive Dashboard</div>
                <p className="text-sm text-gray-700">Explore modules, filters, and crosstabs used by teams to build data‑driven strategies.</p>
              </div>
              <Link href="https://demo.ecofocusworldwide.com/Dashboard-Demo" target="_blank" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow hover:shadow-md">
                Open Demo <ArrowRight className="h-4 w-4"/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2025 STUDY + MINI INSIGHTS */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="text-sm font-semibold text-emerald-700">Participate</div>
            <h3 className="mt-1 text-xl md:text-2xl font-bold">2025 Syndicated Study</h3>
            <p className="mt-2 text-gray-700">
              Add your proprietary questions to our nationally representative survey (n=4,000; MoE ±1.55%). Includes a
              custom report, agreed crosstabs, and access to a <span className="font-semibold">custom Interactive Dashboard</span> at no additional cost.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4 text-emerald-600"/> US Gen Pop, balanced to Census quotas</li>
              <li className="flex items-start gap-2"><BarChart3 className="mt-0.5 h-4 w-4 text-emerald-600"/> Trendline since 2010 (exceptions 2021, 2023)</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white">
                Discuss scope <ArrowRight className="h-4 w-4"/>
              </Link>
              <Link href="/reports/2025-study" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 font-semibold text-gray-900 hover:bg-gray-50">
                Learn more
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="text-sm font-semibold text-emerald-700">No‑cost option</div>
            <h3 className="mt-1 text-xl md:text-2xl font-bold">Mini Insights: Brand Snapshot</h3>
            <p className="mt-2 text-gray-700">
              Limited slots for brands to be included at no cost. Receive a concise custom report with <span className="font-semibold">Brand Awareness</span>,
              <span className="font-semibold"> Customer Behavior</span>, <span className="font-semibold">Purchase Intent</span>, and <span className="font-semibold">Sustainability Perception</span>.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white">
                Check availability <ArrowRight className="h-4 w-4"/>
              </Link>
              <Link href="/reports/mini-insights" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 font-semibold text-gray-900 hover:bg-gray-50">
                Program details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STORE GRID (placeholders) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">One‑off Downloads</h2>
              <p className="mt-2 max-w-2xl text-gray-700">Instant access to focused analyses. Add to cart and checkout securely.</p>
            </div>
            <Link href="/cart" className="text-emerald-700 font-semibold hover:underline">Go to cart →</Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'econuggets-pack', title: 'EcoNuggets: Insights Pack (Q2 2025)', price: 295, img: '/images/store_econuggets.webp' },
              { id: 'packaging-perception', title: 'Packaging & Recyclability Deep Dive', price: 795, img: '/images/store_packaging.webp' },
              { id: 'genz-millennials', title: 'Gen Z & Millennials Sustainability Behaviors', price: 795, img: '/images/store_genz.webp' },
            ].map((p) => (
              <article key={p.id} className="group rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{p.title}</h3>
                  <div className="mt-2 text-emerald-700 font-bold">${p.price.toLocaleString()}</div>
                  <div className="mt-4 flex gap-3">
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold"
                      onClick={() => alert('Add to cart: ' + p.id)}
                    >
                      <ShoppingCart className="h-4 w-4"/> Add to cart
                    </button>
                    <Link href={`/reports/${p.id}`} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50">
                      Preview
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked</h2>
            <p className="mt-2 text-gray-700">Quick facts about our methodology and deliverables.</p>
            <dl className="mt-6 grid gap-6">
              {[
                {
                  q: 'Is your data representative of the US population?',
                  a: 'Yes. Our 4,000‑respondent study is balanced to US Census demographics and yields a ±1.55% margin of error.',
                },
                {
                  q: 'How do you conduct your surveys and how in‑depth are they?',
                  a: 'Online survey, ~20–25 minutes, designed for depth on consumer sustainability attitudes and behaviors.',
                },
                {
                  q: 'Do you offer custom research and consulting?',
                  a: 'Yes. We run qualitative and quantitative custom studies and provide consulting from one‑day workshops to multi‑week programs.',
                },
                {
                  q: 'Can subject matter experts brief my team or speak at events?',
                  a: 'Yes. Whether or not you hold a subscription, we can arrange the right expert with relevant material for your audience.',
                },
              ].map((i) => (
                <div key={i.q} className="rounded-xl border border-gray-200 p-5">
                  <dt className="font-semibold">{i.q}</dt>
                  <dd className="mt-2 text-gray-700">{i.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="text-sm font-semibold text-emerald-700">Methodology</div>
            <h3 className="mt-1 text-xl font-bold">Study at a glance</h3>
            <ul className="mt-3 grid gap-2 text-sm text-gray-800">
              <li>• US adults 18+, nationally representative</li>
              <li>• Sample size: 4,002 (Grocery Shoppers n=3,899)</li>
              <li>• Mode: Online; Duration: 20–25 minutes</li>
              <li>• Margin of error: ±1.55%</li>
              <li>• Fielded: June–July 2024</li>
              <li>• Annual since 2010 (exceptions 2021, 2023)</li>
            </ul>
            <Link href="/about#methodology" className="mt-4 inline-flex items-center gap-2 text-emerald-800 font-semibold hover:underline">
              Learn about our approach <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_500px_at_20%_120%,#C8F5E7_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-gray-200 bg-white/60 backdrop-blur p-8 md:p-12 shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-2xl md:text-3xl font-bold">Need guidance on the right option?</h2>
                <p className="mt-2 text-gray-700">Book a no‑cost discovery call. We’ll clarify objectives and recommend the best path—report, subscription, study participation, or custom research.</p>
              </div>
              <div className="flex md:justify-end">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow hover:shadow-md">
                  Talk to us <ArrowRight className="h-4 w-4"/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
