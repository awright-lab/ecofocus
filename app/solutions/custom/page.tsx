// app/solutions/custom/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CustomHero from '@/app/solutions/custom/CustomHero'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Custom Research | EcoFocus Research',
  description:
    'Bespoke sustainability research—quant, qual, and mixed methods—tailored to your category, buyers, and decisions.',
}

export default function CustomResearchPage() {
  return (
    <>
      <Header />

      <main className="bg-neutral-50">
        <CustomHero />

        {/* ========== Section: Actionable Insights You Can Trust (benefits intro) ========== */}
        <section id="benefits" className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Actionable Insights You Can Trust</h2>
          <p className="mt-3 max-w-4xl text-gray-700">
            Custom projects start with your must-answer questions. We align scope, instrument, and sampling to your
            category realities and timelines — then deliver crisp, decision-ready outputs that stakeholders can use
            immediately.
          </p>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Right-sized studies optimized for speed, rigor, and clarity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Methods that fit: Conjoint/MaxDiff, concept &amp; claims tests, segmentation refreshes, qual depths</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Stakeholder-ready deliverables: story deck, crosstabs, and optional dashboard access</span>
            </li>
          </ul>
        </section>

        {/* ========== Section: Why Choose Custom Research? (3 feature cards) ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-xl font-semibold text-gray-900">Why Choose Custom Research?</h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Immediate Focus on Your Questions',
                desc:
                  'No wasted scope. Every question maps to a decision you need to make — claims, packaging, innovation, or go-to-market.',
              },
              {
                title: 'Consistent, Comparable Rigor',
                desc:
                  'Clean sampling, clear wording, and guardrails that keep results comparable over time and between cohorts.',
              },
              {
                title: 'Audience & Category Breakouts',
                desc:
                  'Cuts by category, generation, lifestyle, and more — plus bespoke cohorts unique to your business.',
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== Section: Coverage You Can Act On (same headings as syndicated) ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-xl font-semibold text-gray-900">Coverage You Can Act On</h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Consumer Lifestyles</h3>
              <p className="mt-2 text-sm text-gray-600">
                What people value day-to-day — and where sustainability shows up in actual habits.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Product Categories</h3>
              <p className="mt-2 text-sm text-gray-600">
                Category-specific expectations and trade-offs across food, beverage, and household.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Packaging Preferences</h3>
              <p className="mt-2 text-sm text-gray-600">
                Which materials, claims, and formats win trust — and which miss.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Sustainability Labels</h3>
              <p className="mt-2 text-sm text-gray-600">
                The role of certifications and trustmarks in purchase consideration.
              </p>
            </div>
          </div>
        </section>

        {/* ========== Section: Project Highlight (clone of "Report Highlight") ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Project Highlight</h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <h3 className="font-semibold text-gray-900">
                Claims Validation for New Pack Design (CPG)
              </h3>
              <p className="mt-2 text-gray-700 text-sm">
                A rapid quant study to test message clarity and believability across three front-of-pack claims, with
                lift quantified among priority cohorts.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact?type=custom"
                  className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Start a Similar Project
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Explore the Dashboard
                </Link>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm">
              <Image
                src="/images/solutions/custom-highlight.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>

        {/* ========== Section: Multiple Access Points (3 cards, identical layout) ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-xl font-semibold text-gray-900">Multiple Access Points to the Insights You Need</h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Interactive Dashboard',
                desc: 'Slice results by audience and export visuals for quick internal sharing.',
                cta: { href: '/dashboard', label: 'View Demo →' },
              },
              {
                title: 'Exportable Crosstabs',
                desc: 'All your priority cuts, pre-built and export-ready — no manual slicing.',
              },
              {
                title: 'Executive Story Decks',
                desc: 'Narrative + key charts + implications tailored to marketing, product, and ESG.',
              },
            ].map((d) => (
              <div key={d.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <h3 className="font-semibold text-gray-900">{d.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{d.desc}</p>
                {'cta' in d && d.cta ? (
                  <div className="mt-3">
                    <Link href={d.cta.href} className="text-sm font-semibold text-emerald-700 hover:underline">
                      {d.cta.label}
                    </Link>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* ========== Section: Real-World Applications (3 subsections) ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-xl font-semibold text-gray-900">Real-World Applications of Custom Insights</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Marketing & Brand Strategy',
                desc:
                  'Validate messages and green equity positioning. Learn which claims and formats resonate with buyers.',
              },
              {
                title: 'Product Innovation',
                desc:
                  'Prioritize features, price tiers, and pack designs with discrete choice, MaxDiff, and rapid claims tests.',
              },
              {
                title: 'Investor & ESG Communications',
                desc:
                  'Data-backed narratives linking consumer priorities to environmental impact and growth.',
              },
            ].map((u) => (
              <div key={u.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <h3 className="font-semibold text-gray-900">{u.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== Section: What Makes Our Research Unmatched (proof points) ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-xl font-semibold text-gray-900">What Makes Our Research Unmatched</h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Trusted Since 2010',
                desc:
                  'A decade+ focused on sustainability research for leading brands, agencies, and NGOs.',
              },
              {
                title: 'Depth & Breadth',
                desc:
                  'Dozens of attitudinal, behavioral, and demographic dimensions — designed for the decisions that matter.',
              },
              {
                title: 'Multi-Sector Relevance',
                desc:
                  'From CPG to retail to policy, our work drives strategy without losing category specificity.',
              },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== Section: Sample Topics Covered (two-column list clone) ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-xl font-semibold text-gray-900">Sample Topics Covered</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                'Consumer priorities & trade-offs',
                'Sustainable lifestyle adoption',
                'Message clarity & believability',
                'Pack/label design preferences',
                'Price/value perception & elasticity',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                'Category & cohort differences',
                'Sustainability label trust',
                'Awareness vs. availability gaps',
                'Attitude → behavior linkage',
                'Year-over-year shifts (if longitudinal)',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ========== Section: See the Data in Action (dashboard CTA + bullets) ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h2 className="text-xl font-semibold text-gray-900">See the Data in Action</h2>
          <p className="mt-2 max-w-3xl text-gray-700">
            Optionally add dashboard access to your project. Filter by audience, compare cohorts, and export
            presentation-ready charts.
          </p>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Explore 90,000+ data points and trend slices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Compare insights by generation, region, and behavior</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Export ready-made visuals</span>
            </li>
          </ul>

          <div className="mt-6">
            <Link
              href="/contact?type=custom"
              className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Talk to an Expert
            </Link>
          </div>
        </section>

        {/* ========== Final CTA (clone) ========== */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ready to Unlock Custom Sustainability Insights?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Share your objectives and timelines — we’ll recommend an approach and scope in plain English.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link
                href="/contact?type=custom"
                className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Request a Proposal
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

