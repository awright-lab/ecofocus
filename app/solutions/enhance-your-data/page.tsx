// app/solutions/enhance-your-data/page.tsx
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
  CheckCircle2, Database, ShieldCheck, GitMerge, BarChart2, CloudUpload, Layers, ClipboardList,
} from 'lucide-react';

/* ------------------------------- Hero (same style) ------------------------------- */
function EnhanceHero() {
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
            Enhance Your Data
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-4">
            Make your data <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8] animate-gradient">richer and more connected</span>
          </h1>
          <p className="text-lg text-gray-200/90 mb-10 max-w-2xl">
            Blend EcoFocus 2024 insights with your first-party data to unlock stronger personas,
            sharper forecasting, and a single source of truth—delivered as a dashboard overlay or
            raw files into your data lake.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#benefits" className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-[#124734] overflow-hidden transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
              before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0">
              <span className="relative z-10">Explore Benefits</span>
            </Link>
            <Link href="/contact?type=enhance-your-data" className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full border border-white/30 hover:bg-white/10 transition-all">
              <span className="relative z-10">Request a Proposal</span>
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
            <Image src="/images/laptop.png" alt="Data Lake Integration Preview" fill className="rounded-xl shadow-2xl object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------- Section Components --------------------------- */

function Badge({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
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
            <span className="text-black/60">Why Enhance Your Data</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge icon={Database} label="2024 dataset" />
            <Badge icon={GitMerge} label="Schema mapping" />
            <Badge icon={ShieldCheck} label="Governance & QA" />
            <Badge icon={BarChart2} label="Dashboard overlay" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Turn siloed data into decision-ready intelligence
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          We align structures, map keys, and blend EcoFocus measures with your first-party signals—
          so teams can analyze faster and with more context.
        </p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Enriched personas & segments',
              body:
                'Fuse sustainability attitudes and behaviors into your CRM or CDP to sharpen targeting and creative.',
            },
            {
              title: 'Unified analytics',
              body:
                'Create a single view across brand, shopper, panel, and EcoFocus—no more swivel-chair analysis.',
            },
            {
              title: 'Forecasting that learns',
              body:
                'Introduce validated EcoFocus features to your models for better signal and stability.',
            },
            {
              title: 'Faster self-serve',
              body:
                'Optional dashboard overlay so business users can slice, filter, and export without analyst bottlenecks.',
            },
            {
              title: 'Flexible delivery paths',
              body:
                'Choose raw files (CSV/Parquet), secure share, or direct lake/object storage delivery.',
            },
            {
              title: 'Enterprise-grade hygiene',
              body:
                'Schema mapping, key merges, QC, and governance support baked into the process.',
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
          Deliverables built for your stack
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Pick the path that fits—raw data ingestion, dashboard overlay, or both.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Layers className="h-6 w-6 text-emerald-700" />,
              title: 'Blended Dataset',
              body:
                'EcoFocus 2024 measures aligned to your schemas with key merges and QC notes for reproducibility.',
            },
            {
              icon: <BarChart2 className="h-6 w-6 text-emerald-700" />,
              title: 'Dashboard Overlay (Optional)',
              body:
                'Your data + EcoFocus in a single interface for self-serve analysis, crosstabs, and exports.',
            },
            {
              icon: <CloudUpload className="h-6 w-6 text-emerald-700" />,
              title: 'Delivery to Your Lake',
              body:
                'Raw files (CSV/Parquet) or direct object storage delivery with governance and access controls.',
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
            Explore Dashboard Overlay
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: 'Scoping & Mapping',
      body:
        'We align on use cases, review your schemas, and define keys or joins. You approve the data spec.',
    },
    {
      title: 'Blend & QA',
      body:
        'EcoFocus 2024 features are merged into your structures. We run data validation and document QC.',
    },
    {
      title: 'Delivery & (Optional) Overlay',
      body:
        'We deliver raw files to your lake or set up an overlay in the dashboard for immediate self-serve.',
    },
    {
      title: 'Enablement',
      body:
        'Stakeholder onboarding, working session, and documentation so teams can move fast with confidence.',
    },
  ];

  return (
    <section id="process" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-black/60">How It Works</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">From mapping to momentum</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          A pragmatic path that respects your data governance while speeding time-to-insight.
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
            href="/contact?type=enhance-your-data"
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
      q: 'What data sources can you blend?',
      a: 'CRM, CDP, commerce, panel, brand trackers, media, and more. We’ll align on keys or create proxy joins.',
    },
    {
      q: 'What formats do you deliver?',
      a: 'CSV, Parquet, or direct object storage delivery. We can also push a dashboard overlay for self-serve.',
    },
    {
      q: 'How do you handle governance and privacy?',
      a: 'We scope to your policies, minimize PII, use secure delivery, and document processes for auditability.',
    },
    {
      q: 'Can we add 2025 data later?',
      a: 'Yes—this engagement is future-proof. 2025 waves can be integrated in a subsequent refresh.',
    },
    {
      q: 'How does this relate to the 2025 Buy-In?',
      a: 'Enhance Your Data uses the validated 2024 dataset. Buy-In lets you add proprietary questions in 2025 and also receive dashboard access.',
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
            href="/contact?type=enhance-your-data"
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
          Ready to enhance your data?
        </h2>
        <p className="mt-2 text-gray-600">
          Blend EcoFocus 2024 with your first-party data—or see the overlay live in the dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/contact?type=enhance-your-data"
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

/* ---------------------------------- Page ---------------------------------- */

export default function EnhanceYourDataPage() {
    return (
      <>
        <Header />
  
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Enhance Your Data' },
          ]}
        />
  
        {/* Hero */}
        <EnhanceHero />
  
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
  
        <InquiryStrip defaultType="Enhance Your Data" context="solutions/enhance-your-data" />
        <Footer />
      </>
    );
  }
