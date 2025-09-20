// app/dashboard/page.tsx
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
  BarChart2,
  LayoutGrid,
  Filter,
  Download,
  Users,
  LineChart,
  ShieldCheck,
  Sparkles,
  Gauge,
  Zap,
  CheckCircle2,
} from 'lucide-react';

/* ---------------------------------- Hero ---------------------------------- */
/** Cinematic video hero matching your subpages (Custom/Syndicated/Enhance) */
function DashboardHero() {
  return (
    <section className="relative max-h-[65vh] flex items-center justify-center overflow-hidden bg-neutral-950 text-white z-0">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover brightness-[0.4]"
        >
          <source
            src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-emerald-900/80 to-blue-900/80" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 w-full max-w-7xl px-6 py-28 grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Dashboard Access
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-4">
            Your sustainability data hub —<br className="hidden md:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8] animate-gradient">
              90,000+ decision-ready datapoints
            </span>
          </h1>

          <p className="text-lg text-gray-200/90 mb-10 max-w-2xl">
            Explore trends, build crosstabs, and share stakeholder-ready visuals in minutes. Seat
            licenses give your team always-on access to EcoFocus intelligence.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#pricing"
              className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-[#124734] overflow-hidden transition-all duration-300
                before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
                before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">See Pricing</span>
            </Link>
            <Link
              href="/contact?type=dashboard"
              className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full border border-white/30 hover:bg-white/10 transition-all"
            >
              <span className="relative z-10">Book a Demo</span>
            </Link>
          </div>
        </motion.div>

        {/* Optional Right Visual */}
        <motion.div
          className="hidden md:block md:col-span-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full aspect-square">
            <Image
              src="/images/laptop.png"
              alt="EcoFocus Dashboard Preview"
              fill
              className="rounded-xl shadow-2xl object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------- Overview ---------------------------------- */

function Overview() {
  const pills = [
    { icon: Users, label: 'U.S. Gen Pop, census-balanced' },
    { icon: LineChart, label: '13 years of trend context' },
    { icon: ShieldCheck, label: 'Validated methodology & QC' },
  ];
  return (
    <section id="overview" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-black/60">At a glance</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pills.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-3 py-1 text-xs shadow ring-1 ring-gray-200"
              >
                <Icon className="h-4 w-4 text-emerald-600" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          All your EcoFocus intelligence in one place
        </h2>
        <p className="mt-2 text-gray-600 max-w-3xl">
          The EcoFocus Dashboard turns raw sustainability data into fast, self-serve answers. Build
          crosstabs, filter by audiences, export charts and tables, and share links with your team.
        </p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: LayoutGrid,
              title: 'Clean information architecture',
              body: 'Find measures quickly with sensible grouping and easy search.',
            },
            {
              icon: Filter,
              title: 'Instant filtering',
              body: 'Slice by demo, attitudes, segments, categories, and more.',
            },
            {
              icon: BarChart2,
              title: 'Crosstabs in seconds',
              body: 'Build tables with significance testing and export your view.',
            },
            {
              icon: Download,
              title: 'One-click exports',
              body: 'Export charts or tables into decks and working docs.',
            },
            {
              icon: Sparkles,
              title: 'Executive-ready visuals',
              body: 'Beautiful charts that help stakeholders align quickly.',
            },
            {
              icon: Zap,
              title: 'Fast onboarding',
              body: 'Short training and quick-start guides so teams can self-serve.',
            },
          ].map(({ icon: Icon, title, body }) => (
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

/* -------------------------------- Features --------------------------------- */

function Features() {
  return (
    <section id="features" className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-black/60">What you can do</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Explore, compare, and share — fast
        </h2>
        <p className="mt-2 text-gray-600 max-w-3xl">
          The dashboard is built for real workflows: answer stakeholder questions, export visuals,
          and keep the team aligned without waiting on ad-hoc requests.
        </p>

        <ul className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'Build crosstabs with significance testing',
            'Filter by audiences, segments, and categories',
            'Export visuals and tables to PPT/CSV',
            'Bookmark and share saved views',
            'Switch between historical trend and latest wave',
            'Get guided onboarding and help docs',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-xl bg-white border border-gray-200 p-4 shadow-sm"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-[2px]" />
              <span className="text-sm text-gray-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------- Pricing ---------------------------------- */
/** Swap prices/limits as needed. You can also add a monthly/annual toggle later. */

function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: '$2,500',
      cadence: 'per month',
      blurb: 'Good for a small insights team getting started.',
      features: [
        'Up to 5 seats',
        'Core dashboard modules',
        'Email support',
        'Export charts & tables',
      ],
      cta: { label: 'Start a Conversation', href: '/contact?type=dashboard&plan=starter' },
      highlight: false,
    },
    {
      name: 'Team',
      price: '$4,150',
      cadence: 'per month',
      blurb: 'For teams that need broader access and saved views.',
      features: [
        'Up to 15 seats',
        'All modules + trend views',
        'Priority support',
        'Saved views & sharing',
      ],
      cta: { label: 'Talk to Sales', href: '/contact?type=dashboard&plan=team' },
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: '$6,200',
      cadence: 'per month',
      blurb: 'Organization-wide access and success enablement.',
      features: [
        'Unlimited seats',
        'All modules + admin controls',
        'Dedicated success manager',
        'SAML/SSO & governance options',
      ],
      cta: { label: 'Contact Us', href: '/contact?type=dashboard&plan=enterprise' },
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-black/60">Pricing</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Seat licenses</h2>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Annual agreements with onboarding included. Need data lake delivery or custom modules?
          Pair with <Link href="/solutions/enhance-your-data" className="text-emerald-700 underline">Enhance Your Data</Link> or{' '}
          <Link href="/solutions/syndicated-buy-in" className="text-emerald-700 underline">Syndicated Study Buy-In</Link>.
        </p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-6 shadow-sm bg-white ${
                t.highlight
                  ? 'border-emerald-400 ring-2 ring-emerald-200'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-emerald-700" />
                <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-700">{t.blurb}</p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{t.price}</span>
                <span className="text-sm text-gray-600">{t.cadence}</span>
              </div>

              <ul className="mt-4 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-[2px]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={t.cta.href}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow ${
                  t.highlight
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {t.cta.label}
              </Link>

              <p className="mt-3 text-xs text-gray-500">
                Volume pricing and multi-year discounts available.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQs ----------------------------------- */

function FAQs() {
  const faqs = [
    {
      q: 'What data is included?',
      a: 'Syndicated EcoFocus measures covering sustainability attitudes, behaviors, categories, and demographics. Ask us about optional modules.',
    },
    {
      q: 'How many seats do we get?',
      a: 'Each plan lists seat allowances. You can add seats or upgrade at any time.',
    },
    {
      q: 'Can we export data?',
      a: 'Yes—export charts and tables. For raw files and data lake delivery, pair with Enhance Your Data.',
    },
    {
      q: 'Is onboarding included?',
      a: 'Yes—quick-start training, help docs, and support are included with all plans.',
    },
    {
      q: 'Do you support SSO?',
      a: 'Enterprise plans can include SAML/SSO and admin controls.',
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
            href="/contact?type=dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow hover:bg-emerald-700"
          >
            Ask a Question
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- CTA ----------------------------------- */

function PageCTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Ready to put EcoFocus at your team’s fingertips?
        </h2>
        <p className="mt-2 text-gray-600">
          Compare plans or reach out for a quick demo and recommendations.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="#pricing"
            className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
          >
            See Pricing
          </Link>
          <Link
            href="/contact?type=dashboard"
            className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- Page ---------------------------------- */

export default function DashboardPage() {
  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard' },
        ]}
      />

      {/* Hero */}
      <DashboardHero />

      {/* Sticky Section Nav */}
      <StickySectionNav
        items={[
          { id: 'overview', label: 'Overview' },
          { id: 'features', label: 'Features' },
          { id: 'pricing', label: 'Pricing' },
          { id: 'faqs', label: 'FAQs' },
        ]}
      />

      <main className="bg-white">
        <Overview />
        <Features />
        <Pricing />
        <FAQs />
        <PageCTA />
        <InquiryStrip defaultType="Dashboard Access" context="dashboard" />
      </main>

      <Footer />
    </>
  );
}
