// app/solutions/custom/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CustomHero from '@/app/solutions/custom/CustomHero'
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

        {/* Value prop */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Actionable answers to your organization’s unique questions
            </h2>
            <p className="mt-3 text-gray-600">
              We combine a decade of sustainability expertise with the right methodology for your objectives—so you can
              move from hypothesis to decision with confidence.
            </p>
          </div>
        </section>

        {/* Why choose custom */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <h3 className="text-xl font-semibold text-gray-900">Why choose Custom Research?</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Built for your category',
                desc:
                  'From food & beverage to household, we tailor sampling and instruments to your market realities and constraints.',
              },
              {
                title: 'Faster path to clarity',
                desc:
                  'Lean designs, pragmatic scopes, and stakeholder-ready deliverables keep decisions moving—without bloat.',
              },
              {
                title: 'Methodology that fits',
                desc:
                  'Quant, qual, or mixed methods—conjoint, MaxDiff, concept & claims tests, segment refreshes, and more.',
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <h4 className="font-semibold text-gray-900">{c.title}</h4>
                <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Approaches / Coverage */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h3 className="text-xl font-semibold text-gray-900">Approaches we use</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Quantitative',
                points: [
                  'Concept, claims & pack tests',
                  'Conjoint / MaxDiff',
                  'TURF & feature prioritization',
                  'Market sizing & incidence',
                ],
              },
              {
                title: 'Qualitative',
                points: [
                  '1:1 depth interviews',
                  'Mini-groups & co-creation',
                  'In-home & shop-along',
                  'Usability / diary studies',
                ],
              },
              {
                title: 'Mixed Methods',
                points: [
                  'Segmentation builds & refreshes',
                  'Journey mapping',
                  'Attitude-behavior linkage',
                  'Price & value perception',
                ],
              },
            ].map((col) => (
              <div key={col.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <h4 className="font-semibold text-gray-900">{col.title}</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {col.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Deliverables / Access points (mirror structure) */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h3 className="text-xl font-semibold text-gray-900">Deliverables you can act on</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Executive Story Decks',
                desc:
                  'Clear narrative, key charts, and implications for marketing, product, and sustainability teams.',
              },
              {
                title: 'Exportable Crosstabs',
                desc:
                  'Ready-to-share data tables aligned to your priorities—no manual slicing required.',
              },
              {
                title: 'Optional Dashboard Access',
                desc:
                  'Explore trends with our web-based platform. Filter by audience and export visuals.',
                cta: { href: '/dashboard', label: 'Explore the Dashboard →' },
              },
            ].map((d) => (
              <div key={d.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <h4 className="font-semibold text-gray-900">{d.title}</h4>
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

        {/* Use cases */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h3 className="text-xl font-semibold text-gray-900">Where Custom Research shines</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Marketing & Brand',
                desc:
                  'Positioning, message & claims, green equity tracking, and whitespace opportunity validation.',
              },
              {
                title: 'Product & Innovation',
                desc:
                  'Concept prioritization, feature trade-offs, pack/label tests, and category-specific purchase drivers.',
              },
              {
                title: 'ESG & Investor',
                desc:
                  'Data-backed narratives that connect consumer priorities with environmental impact goals.',
              },
            ].map((u) => (
              <div key={u.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <h4 className="font-semibold text-gray-900">{u.title}</h4>
                <p className="mt-2 text-sm text-gray-600">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h3 className="text-xl font-semibold text-gray-900">How we work (fast)</h3>
          <ol className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { n: 1, t: 'Scope', d: 'Align on objectives, audiences, and must-answer questions.' },
              { n: 2, t: 'Design', d: 'Right-sized instrument and plan; stakeholders onboarded.' },
              { n: 3, t: 'Field', d: 'Quality controls, progress check-ins, and early signal reads.' },
              { n: 4, t: 'Deliver', d: 'Decision-ready outputs with implications and next steps.' },
            ].map((s) => (
              <li key={s.n} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-semibold">
                  {s.n}
                </div>
                <h4 className="font-semibold text-gray-900">{s.t}</h4>
                <p className="mt-1 text-sm text-gray-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to design your study?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Share your objectives and timelines—our team will recommend an approach and scope in plain English.
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
                href="/reports"
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Explore Reports
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
