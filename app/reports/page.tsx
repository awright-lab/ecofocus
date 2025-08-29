// app/reports/page.tsx
'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  ShieldCheck,
  ShoppingCart,
  BarChart2,
  Users,
  TrendingUp,
  LayoutDashboard,
  HelpCircle,
  ArrowRight,
  Tag,
  Database,
} from 'lucide-react';

const PAID_TOPICS = [
  'Packaging',
  'Claims & Messaging',
  'Consumer Segments',
  'Retail & Channel',
  'Category Deep Dives',
];

const FREE_TOPICS = [
  'The Green Mindset',
  'Packaging in the Spotlight',
  'Trust & Accountability',
  'The Recycling Reality',
  'The Price of Green',
  'Knowledge is Power',
];

export default function ReportsForkPage() {
  return (
    <>
      <Header />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports' }]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-blue-900/80" />
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Reports</h1>
          <p className="mt-2 text-emerald-100 max-w-2xl">
            Choose paid 2025 reports for purchase, or explore complimentary 2024 downloads.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Link
              href="/reports/paid"
              className="group rounded-2xl bg-white/5 border border-white/15 p-6 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-emerald-300" />
                <h2 className="text-xl font-semibold">Paid Reports</h2>
              </div>
              <p className="mt-2 text-sm text-emerald-50">
                2025 flagship and focused reports. Buy direct or contact our team.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90">
                View paid reports <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/reports/free"
              className="group rounded-2xl bg-white/5 border border-white/15 p-6 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <h2 className="text-xl font-semibold">Free Reports</h2>
              </div>
              <p className="mt-2 text-sm text-emerald-50">
                Complimentary downloads (email gated), including 2024 SIR and topical slices.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90">
                View free downloads <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat icon={<Users className="h-5 w-5" />} title="4,000+ respondents" desc="National sample each wave" />
            <Stat icon={<TrendingUp className="h-5 w-5" />} title="13 years of trends" desc="Comparable KPIs and cohorts" />
            <Stat icon={<BarChart2 className="h-5 w-5" />} title="90k+ data points" desc="Cross-tabs & ready-to-use charts" />
          </div>
        </div>
      </section>

      {/* Which should I choose? */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-black/60">Guide</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Which reports are right for me?</h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Paid and Free serve different needs. Use this quick guide to jump to the best fit.
          </p>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <ChoiceCard
              eyebrow="Paid (2025)"
              title="Decision-ready depth, latest wave"
              bullets={[
                'Latest data & fresh analysis',
                'Focused slices and flagship report',
                'Licensing for internal use',
                'Buy direct or contact our team',
              ]}
              href="/reports/paid"
              cta="Explore paid"
            />
            <ChoiceCard
              eyebrow="Free (2024)"
              title="Complimentary downloads"
              bullets={[
                'Trusted 2024 highlights',
                'Topic slices and full SIR',
                'Email-gated delivery',
                'Great for orientation & testing',
              ]}
              href="/reports/free"
              cta="Browse free"
            />
          </div>
        </div>
      </section>

      {/* Topics quick links */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-4">
          <div className="rounded-2xl border bg-gradient-to-b from-emerald-50 to-white p-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-emerald-700" />
              <h3 className="text-lg font-semibold text-gray-900">Explore by topic</h3>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-6">
              {/* Paid topics */}
              <div>
                <div className="text-xs font-semibold text-emerald-800/80">Paid (2025)</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PAID_TOPICS.map((t) => (
                    <Link
                      key={t}
                      href={`/reports/paid?topic=${encodeURIComponent(t)}`}
                      className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Free topics */}
              <div>
                <div className="text-xs font-semibold text-emerald-800/80">Free (2024)</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FREE_TOPICS.map((t) => (
                    <Link
                      key={t}
                      href={`/reports/free?topic=${encodeURIComponent(t)}`}
                      className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Secondary CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/solutions/syndicated-study-2025"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                2025 Syndicated Study Buy-In <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/solutions/data-enrichment"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Enhance Your Data <Database className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard promo */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-blue-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border bg-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-emerald-700" />
              <h3 className="text-xl font-semibold text-gray-900">Prefer it interactive?</h3>
            </div>
            <p className="text-sm text-gray-700 md:ml-auto md:max-w-xl">
              License seats to our DisplayR-powered dashboard for self-serve crosstabs and charts across 90k+ data points.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Explore the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-black/60">FAQ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Common questions</h2>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <FAQ q="What’s the difference between Paid and Free?"
                 a="Paid (2025) includes the latest wave with deeper analysis and licensing for internal use. Free (2024) includes complimentary downloads from the previous wave, email-gated." />
            <FAQ q="Can I get the raw data?"
                 a="Yes — our Enhance Your Data service blends EcoFocus 2024 with your datasets and provides matched crosstabs and governance guidance." />
            <FAQ q="Do Paid reports include dashboard access?"
                 a="Paid programs can include dashboard seats; the number of seats scales by organization size. We’ll align during discovery." />
            <FAQ q="How is licensing handled?"
                 a="Paid content includes a standard internal-use license. We can scope broader usage if needed." />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ===== Small presentational helpers ===== */

function Stat({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700">{icon}</div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-600">{desc}</div>
      </div>
    </div>
  );
}

function ChoiceCard({
  eyebrow,
  title,
  bullets,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  bullets: string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-emerald-300 hover:shadow-sm transition">
      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
        <span className="h-2 w-2 rounded-full bg-emerald-600" />
        <span className="text-black/60">{eyebrow}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-gray-900">{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-gray-200 bg-white p-4 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-emerald-700" />
          <span className="text-sm font-semibold text-gray-900">{q}</span>
        </div>
        <span className="text-gray-500 text-xs">Expand</span>
      </summary>
      <p className="mt-3 text-sm text-gray-700">{a}</p>
    </details>
  );
}
















