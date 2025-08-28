// app/solutions/custom/page.tsx
'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import StickySectionNav from '@/components/StickySectionNav';
import InquiryStrip from '@/components/InquiryStrip';

// ✅ Your existing hero that you shared (exact style)
import CustomHero from '@/app/solutions/custom/CustomHero';

import {
  FlaskConical,
  Target,
  ClipboardList,
  Layers,
  BarChart2,
  Presentation,
  Gauge,
  ShieldCheck,
} from 'lucide-react';

/* ----------------------------- Section: Benefits ---------------------------- */

function Benefits() {
  const cards = [
    {
      title: 'Designed for your decision',
      body:
        'We scope around the exact choice in front of your team—claims, packs, concepts, pricing, audience, or messaging.',
      icon: Target,
    },
    {
      title: 'Methodology that fits',
      body:
        'From rapid quant to mixed-method designs, we pick the approach that balances rigor with timeline and budget.',
      icon: FlaskConical,
    },
    {
      title: 'Reusable building blocks',
      body:
        'Leverage proven modules from EcoFocus to speed time-to-field while keeping space for bespoke questions.',
      icon: Layers,
    },
    {
      title: 'Faster time-to-insight',
      body:
        'Stakeholder-ready visuals and toplines prioritized for action—not just data dumps.',
      icon: Gauge,
    },
    {
      title: 'Benchmark to EcoFocus',
      body:
        'Where useful, compare your results to syndicated norms and 13 years of trend context.',
      icon: BarChart2,
    },
    {
      title: 'Governance & quality',
      body:
        'Question design, sample plan, checks, and documentation aligned to best practices and your internal standards.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="benefits" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-black/60">Why Custom with EcoFocus</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Bespoke research—without reinventing the wheel
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          We combine custom design with EcoFocus’s validated foundations to get you reliable answers, faster.
        </p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ title, body, icon: Icon }) => (
            <div
              key={title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-emerald-600 mt-[2px]" />
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Section: Offerings ---------------------------- */

function Offerings() {
  const offerings = [
    {
      title: 'Concept & Claims Testing',
      body:
        'Screen and optimize concepts or claims with diagnostics, preference splits, and reasons-to-believe.',
    },
    {
      title: 'Packaging & Creative',
      body:
        'Evaluate front-of-pack, design systems, and messaging ladders with shelf realism or monadic cells.',
    },
    {
      title: 'Audience & Segmentation',
      body:
        'Define need-states or attitudes; build practical segments that map to activation, media, and product.',
    },
    {
      title: 'Price & Feature Trade-offs',
      body:
        'Conjoint and discrete choice to model willingness-to-pay and simulate portfolio scenarios.',
    },
    {
      title: 'Usage & Attitudes Deep Dives',
      body:
        'Zoom in on your categories and moments to surface whitespace, frictions, and triggers.',
    },
    {
      title: 'Pre/Post & Tracker Modules',
      body:
        'Measure lift or track shifts over time; plug modules into your existing trackers when helpful.',
    },
  ];

  return (
    <section id="offerings" className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-black/60">What We Can Build</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Custom study types</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Examples of the work we run most often—tuned to your categories, audiences, and markets.
        </p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((o) => (
            <div key={o.title} className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Presentation className="h-5 w-5 text-emerald-700 mt-[2px]" />
                <div>
                  <h3 className="font-semibold text-gray-900">{o.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{o.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/contact?type=custom"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-6 py-3 text-emerald-700 font-semibold hover:bg-emerald-50"
          >
            Start a Discovery Call
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Section: How It Works -------------------------- */

function HowItWorks() {
  const steps = [
    {
      title: 'Discovery & Design',
      body:
        'Clarify decisions, KPIs, and success criteria. We shape the instrument and sampling plan together.',
    },
    {
      title: 'Fieldwork & QC',
      body:
        'We launch with piloting and checks; you get transparent status and milestone updates.',
    },
    {
      title: 'Readout & Activation',
      body:
        'Executive-ready story, data tables/crosstabs, and optional dashboard overlay for self-serve.',
    },
    {
      title: 'Working Session',
      body:
        'Bring stakeholders together to prioritize implications, align next steps, and plan follow-ups.',
    },
  ];

  return (
    <section id="process" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-black/60">How It Works</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">From brief to decision</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          A pragmatic path that respects timelines and budgets without compromising quality.
        </p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <ClipboardList className="h-5 w-5 text-emerald-600 mt-[2px]" />
                <div>
                  <div className="text-xs text-gray-500">Step {idx + 1}</div>
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{s.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/contact?type=custom"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-6 py-3 text-emerald-700 font-semibold hover:bg-emerald-50"
          >
            Schedule a Working Session
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Section: FAQs -------------------------------- */

function FAQs() {
  const faqs = [
    {
      q: 'What sample sizes do you support?',
      a: 'From rapid n=200 checks to robust n=1,000+ studies, with oversamples as needed. We’ll recommend the right size for your decision.',
    },
    {
      q: 'Can you recruit specific audiences?',
      a: 'Yes—category users, brand users, competitive switchers, lifestage cohorts, and more. We’ll outline feasibility during discovery.',
    },
    {
      q: 'Do we get access to the dashboard?',
      a: 'Yes—many custom projects include a dashboard overlay or can be paired with Dashboard Access seat licenses.',
    },
    {
      q: 'How fast can we move?',
      a: 'Rapid studies can field and turn around toplines in days. Complex, multi-cell designs take longer; we’ll share a clear timeline up front.',
    },
    {
      q: 'Can results be integrated with our data?',
      a: 'Yes—pair with Enhance Your Data to land raw files in your lake or to map custom features into your models.',
    },
  ];

  return (
    <section id="faqs" className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-black/60">FAQs</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Good to know</h2>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">{f.q}</h3>
              <p className="mt-1 text-sm text-gray-700">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/contact?type=custom"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow hover:bg-emerald-700"
          >
            Ask a Question
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Section: CTA --------------------------------- */

function PageCTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Ready to scope your custom study?
        </h2>
        <p className="mt-2 text-gray-600">
          Share your decision, timeline, and target audiences—we’ll come back with a right-sized plan.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/contact?type=custom"
            className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
          >
            Request a Proposal
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------- Page ------------------------------------- */

export default function CustomResearchPage() {
  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: 'Custom Research' },
        ]}
      />

      {/* Hero (exact style via your component) */}
      <CustomHero />

      {/* Sticky Section Nav */}
      <StickySectionNav
        items={[
          { id: 'benefits', label: 'Benefits' },
          { id: 'offerings', label: 'Offerings' },
          { id: 'process', label: 'Process' },
          { id: 'faqs', label: 'FAQs' },
        ]}
      />

      <main className="bg-white">
        <Benefits />
        <Offerings />
        <HowItWorks />
        <FAQs />
        <PageCTA />
      </main>

      <InquiryStrip defaultType="Custom Research" context="solutions/custom" />
      <Footer />
    </>
  );
}


