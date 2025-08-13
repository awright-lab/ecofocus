'use client';

import React from 'react';
import { MobileShell } from '@/components/mobile/MobileShell';
import { SnapSection } from '@/components/mobile/SnapSection';
import { StatChips } from '@/components/mobile/StatChips';
import { ReportCardFeatured } from '@/components/mobile/ReportCardFeatured';
import { SolutionsTabs } from '@/components/mobile/SolutionsTabs';
import { NuggetCarousel } from '@/components/mobile/NuggetCarousel';
import { PartnersScroller } from '@/components/mobile/PartnersScroller';
import { DashboardTeaser } from '@/components/mobile/DashboardTeaser';

export default function MobileHomePage() {
  return (
    <MobileShell>
      {/* HERO */}
      <SnapSection id="hero">
        <div className="relative h-full w-full">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4" // use your actual path
            poster="/images/hero_poster.jpg"
            playsInline
            muted
            loop
            autoPlay
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex h-full flex-col justify-end p-5 gap-3">
            <div className="max-w-[22ch] text-white">
              <h1 className="text-2xl font-bold leading-tight">
                Sustainability Insights That Drive Growth
              </h1>
              <p className="mt-1 text-sm opacity-90">
                Data‑backed research to guide sustainability decisions since 2010.
              </p>
            </div>
            <div className="flex gap-2">
              <a href="#report" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow">
                Buy Report
              </a>
              <a href="#solutions" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur">
                Explore Solutions
              </a>
            </div>
          </div>
        </div>
      </SnapSection>

      {/* QUICK STATS */}
      <SnapSection id="stats">
        <div className="h-full w-full bg-white px-4 py-6">
          <h2 className="mb-4 text-lg font-semibold">At‑a‑glance</h2>
          <StatChips stats={[
            { label: '13+ Years', sub: 'Syndicated research' },
            { label: '90k+', sub: 'Data points' },
            { label: '±1.55%', sub: 'Margin of error' },
          ]} />
        </div>
      </SnapSection>

      {/* FEATURED REPORT */}
      <SnapSection id="report">
        <div className="h-full w-full bg-slate-50 px-4 py-6">
          <h2 className="mb-3 text-lg font-semibold">Sustainability Insights Report</h2>
          <ReportCardFeatured
            title="Strategic Insights on Sustainability & Consumer Behavior"
            price={4995}
            bullets={[
              'Demographic differences in eco attitudes',
              'Packaging & recyclability perceptions',
              'Corporate sustainability expectations',
              'Barriers to sustainable choices',
            ]}
            ctaHref="/reports/sustainability-insights-2025"
          />
        </div>
      </SnapSection>

      {/* SOLUTIONS */}
      <SnapSection id="solutions">
        <div className="h-full w-full bg-white px-4 py-6">
          <h2 className="mb-4 text-lg font-semibold">Solutions</h2>
          <SolutionsTabs tabs={[
            {
              key: 'syndicated',
              title: 'Syndicated',
              bullets: [
                'Annual US study (n=4,000) balanced to Census',
                'Interactive dashboard with crosstabs',
                'Trend data since 2010',
              ],
              cta: { label: 'See Dashboard Demo', href: 'https://demo.ecofocusworldwide.com/Dashboard-Demo' },
            },
            {
              key: 'custom',
              title: 'Custom',
              bullets: [
                'B2C & B2B research (qual & quant)',
                'Questionnaire + sampling design',
                'Executive summary & workshop',
              ],
              cta: { label: 'Start a Discovery Call', href: '/contact' },
            },
            {
              key: 'data-infusion',
              title: 'Data Infusion',
              bullets: [
                'Enrich your data with EcoFocus context',
                'Customer personas with sustainability lens',
                'Frictionless integration to BI stacks',
              ],
              cta: { label: 'Talk to an Analyst', href: '/contact' },
            },
          ]} />
        </div>
      </SnapSection>

      {/* DASHBOARD TEASER */}
      <SnapSection id="dashboard">
        <div className="h-full w-full bg-slate-50 px-4 py-6">
          <DashboardTeaser />
        </div>
      </SnapSection>

      {/* ECONUGGETS */}
      <SnapSection id="insights">
        <div className="h-full w-full bg-white px-4 py-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">EcoNuggets</h2>
            <a href="/insights" className="text-sm font-medium text-emerald-700">See all</a>
          </div>
          <NuggetCarousel items={[
            { id: '1', title: 'Gen Z parents push recycling habits', tag: 'Behavior', href: '/insights/gen-z-parents-recycling' },
            { id: '2', title: 'Price vs. planet: who budges?', tag: 'Attitudes', href: '/insights/price-vs-planet' },
            { id: '3', title: 'Packaging credibility signals', tag: 'Packaging', href: '/insights/packaging-credibility' },
          ]} />
        </div>
      </SnapSection>

      {/* WHY ECOFOCUS (Say–Do Mini) + PARTNERS */}
      <SnapSection id="why-partners">
        <div className="h-full w-full bg-slate-50 px-4 py-6">
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold">The Say–Do Gap, Quantified</h3>
            <p className="mt-1 text-sm text-slate-600">We separate intent from action to uncover where behavior actually changes—and why.</p>
            <div className="mt-3 h-24 w-full rounded-lg bg-gradient-to-r from-emerald-200 to-yellow-200" />
            <a href="/methods/say-do-gap" className="mt-3 inline-block text-sm font-medium text-emerald-700">See how we measure →</a>
          </div>

          <h2 className="mb-2 text-lg font-semibold">Trusted by</h2>
          <PartnersScroller logos={[
            { src: '/logos/logo1.png', alt: 'Partner 1' },
            { src: '/logos/logo2.png', alt: 'Partner 2' },
            { src: '/logos/logo3.png', alt: 'Partner 3' },
            { src: '/logos/logo4.png', alt: 'Partner 4' },
            { src: '/logos/logo5.png', alt: 'Partner 5' },
          ]} />
        </div>
      </SnapSection>

      {/* FINAL CTA */}
      <SnapSection id="cta">
        <div className="flex h-full w-full flex-col items-center justify-center bg-emerald-700 p-6 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to act on sustainability?</h2>
          <p className="mt-2 max-w-[28ch] text-sm opacity-90">
            Book a discovery call or explore our solutions designed to turn data into decisions.
          </p>
          <div className="mt-4 flex gap-2">
            <a href="/contact" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-700">Request a Consultation</a>
            <a href="#solutions" className="rounded-full bg-emerald-600/20 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/40">Explore Solutions</a>
          </div>
        </div>
      </SnapSection>
    </MobileShell>
  );
}