// app/solutions/syndicated-buy-in/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import StickySectionNav from '@/components/StickySectionNav';
import InquiryStrip from '@/components/InquiryStrip';
import {
  CheckCircle2, Users, BarChart2, LineChart, BadgeCheck,
  ClipboardList, Database, BookOpenCheck,
} from 'lucide-react';

/* ------------------------------- Hero (same style) ------------------------------- */
function SyndicatedBuyInHero() {
  return (
    <section className="relative max-h-[65vh] flex items-center justify-center overflow-hidden bg-neutral-950 text-white z-0">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover brightness-[0.4]">
          <source src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-emerald-900/80 to-blue-900/80" />
      </div>
      <div className="relative z-20 w-full max-w-7xl px-6 py-28 grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Syndicated Study Buy-In (2025)
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-4">
            Decision-ready sustainability intelligence —<br className="hidden md:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8] animate-gradient">
              powered by your questions
            </span>
          </h1>
          <p className="text-lg text-gray-200/90 mb-10 max-w-2xl">
            Join our nationally representative 2025 EcoFocus study and add proprietary modules.
            Get executive-ready reporting, crosstabs, and dashboard access for your team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#benefits" className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-[#124734] overflow-hidden transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
              before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0">
              <span className="relative z-10">Explore Benefits</span>
            </Link>
            <Link href="/contact?type=syndicated-buy-in" className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full border border-white/30 hover:bg-white/10 transition-all">
              <span className="relative z-10">Request Details</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hidden md:block md:col-span-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full aspect-square">
            <Image src="/images/laptop.png" alt="EcoFocus Dashboard Preview" fill className="rounded-xl shadow-2xl object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------- Sections --------------------------------- */

function StatPill({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-3 py-1 text-xs shadow ring-1 ring-gray-200">
      <Icon className="h-4 w-4 text-emerald-600" />
      <span>{label}</span>
    </div>
  );
}

function Benefits() {
  return (
    <section id="benefits" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-black/60">Why Join the 2025 Wave</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatPill icon={Users} label="4,000+ US Gen Pop" />
            <StatPill icon={BadgeCheck} label="Census-balanced" />
            <StatPill icon={BarChart2} label="±1.55% MoE" />
            <StatPill icon={LineChart} label="13 years of trends" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          A faster, smarter way to answer the questions in front of your team
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Add targeted modules to our proven study framework, then analyze in minutes with
          dashboard crosstabs and ready-to-share visuals.
        </p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Add your proprietary questions',
              body:
                'Field custom modules alongside our syndicated backbone to get exactly the evidence your stakeholders need.',
            },
            {
              title: 'Instant analysis in the Dashboard',
              body:
                'Spin up crosstabs, filters, and exports on day one—no analyst bottleneck required.',
            },
            {
              title: 'Benchmark against national norms',
              body:
                'Understand how your audiences compare to Gen Pop across sustainability attitudes and behaviors.',
            },
            {
              title: 'Executive-ready storytelling',
              body:
                'Receive a concise readout with insights, data-backed takeaways, and clear recommendations.',
            },
            {
              title: 'Lower cost than standalone custom',
              body:
                'Leverage shared infrastructure; comparable proprietary studies often exceed $35K.',
            },
            {
              title: 'Future-proof your roadmap',
              body:
                'Track changes over time and keep teams aligned with trend-based evidence, not hunches.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-[2px]" />
                <div>
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{card.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Deliverables() {
  return (
    <section id="deliverables" className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-black/60">What You Receive</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Deliverables tailored for decisions
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Everything you need to inform the next move—from toplines to deep dives.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <BookOpenCheck className="h-6 w-6 text-emerald-700" />,
              title: 'Executive Report',
              body:
                'A concise narrative of findings with insights and clear takeaways your leadership can act on.',
            },
            {
              icon: <BarChart2 className="h-6 w-6 text-emerald-700" />,
              title: 'Crosstabs & Data Tables',
              body:
                'Custom crosstabs per the SOW for focused analysis and stakeholder-ready data views.',
            },
            {
              icon: <Database className="h-6 w-6 text-emerald-700" />,
              title: 'Dashboard Access',
              body:
                'Interactive dashboard access for your team with onboarding and quick-start support.',
            },
          ].map((d) => (
            <div key={d.title} className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                {d.icon}
                <div>
                  <h3 className="font-semibold text-gray-900">{d.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{d.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow hover:bg-emerald-700"
          >
            View Dashboard Options
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: 'Discovery & Scope',
      body:
        'Align on objectives, target audiences, and success criteria. We finalize your custom questions and SOW.',
    },
    {
      title: 'Fieldwork',
      body:
        'Your module fields in the 2025 EcoFocus study, balanced to U.S. Census quotas for robust, reliable insights.',
    },
    {
      title: 'Delivery & Onboarding',
      body:
        'Receive your report and crosstabs; we onboard your team to the dashboard for rapid self-serve analysis.',
    },
    {
      title: 'Working Session',
      body:
        'Optional readout workshop to align stakeholders, prioritize actions, and plan follow-ups.',
    },
  ];

  return (
    <section id="process" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-black/60">How It Works</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">From kickoff to decision</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          A clear path from scope to insights—designed to keep your team moving.
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
            href="/contact?type=syndicated-buy-in"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-6 py-3 text-emerald-700 font-semibold hover:bg-emerald-50"
          >
            Start a Discovery Call
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  const faqs = [
    {
      q: 'Who is included in the sample?',
      a: 'U.S. Gen Pop 18+, balanced to U.S. Census quotas. Typical n=4,000+, enabling robust crosstabs.',
    },
    {
      q: 'Can we add our own questions?',
      a: 'Yes—your proprietary module fields alongside the syndicated backbone. We’ll help with wording and best practices.',
    },
    {
      q: 'What do we get at the end?',
      a: 'Executive report, crosstabs per SOW, and dashboard access with onboarding for your team.',
    },
    {
      q: 'What about timelines?',
      a: 'We align your module during scoping; fieldwork and reporting follow the study schedule. We can share current dates during discovery.',
    },
    {
      q: 'Can this integrate with our data lake?',
      a: 'Yes—pair this with “Enhance Your Data” to enrich your internal datasets or overlay results in the dashboard.',
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
            href="/contact?type=syndicated-buy-in"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow hover:bg-emerald-700"
          >
            Ask a Question
          </Link>
        </div>
      </div>
    </section>
  );
}

function PageCTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Ready to join the 2025 wave?
        </h2>
        <p className="mt-2 text-gray-600">
          Get details on modules, timelines, and deliverables—or explore the dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/contact?type=syndicated-buy-in"
            className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
          >
            Request Details
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

/* ---------------------------------- Page ---------------------------------- */

export default function SyndicatedBuyInPage() {
    return (
      <>
        <Header />
  
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Syndicated Study Buy-In' },
          ]}
        />
  
        {/* Hero */}
        <SyndicatedBuyInHero />
  
        {/* Sticky Section Nav */}
        <StickySectionNav
          items={[
            { id: 'benefits', label: 'Benefits' },
            { id: 'deliverables', label: 'Deliverables' },
            { id: 'process', label: 'Process' },
            { id: 'faqs', label: 'FAQs' },
          ]}
        />
  
        <main className="bg-white">
          <Benefits />
          <Deliverables />
          <HowItWorks />
          <FAQs />
          <PageCTA />
        </main>
  
        <InquiryStrip defaultType="Syndicated Study Buy-In" context="solutions/syndicated-buy-in" />
        <Footer />
      </>
    );
  }
