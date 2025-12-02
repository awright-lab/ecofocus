'use client';

import { Database, Users, HelpCircle, ShieldCheck } from 'lucide-react';

type Pillar = {
  icon: JSX.Element;
  title: string;
  body: string;
  iconBg: string;
};

const pillars: Pillar[] = [
  {
    icon: <Database className="h-5 w-5 text-emerald-700" />,
    title: 'Wrap EcoFocus Around Your Data',
    body:
      'Layer 13+ years of sustainability attitudes and behaviors on top of your sales, CRM, panel, and research data—so every metric has context.',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: <Users className="h-5 w-5 text-amber-700" />,
    title: 'Build Sustainability Personas',
    body:
      'Fuse your segments with EcoFocus psychographics, behaviors, and willingness-to-pay to create purpose-driven personas your teams can act on.',
    iconBg: 'bg-amber-100',
  },
  {
    icon: <HelpCircle className="h-5 w-5 text-teal-700" />,
    title: 'Explain the “Why” Behind KPIs',
    body:
      'Diagnose dips in sales, conversion, or engagement by tying performance to trust, materials, claims, and evolving sustainability expectations.',
    iconBg: 'bg-teal-100',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-cyan-800" />,
    title: 'Benchmark & De-Risk Decisions',
    body:
      'Anchor your internal data to a nationally representative sustainability baseline—reducing bias and over-read while sharpening decisions.',
    iconBg: 'bg-cyan-100',
  },
];

export default function IntegrationOverview() {
  return (
    <section
      id="integration-overview"
      className="relative bg-white"
      aria-labelledby="integration-overview-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">Integration Overview</span>
        </div>

        {/* Heading + copy (match syndicated overview layout) */}
        <div className="mt-0 md:mt-2 grid grid-cols-1 md:grid-cols-12 md:items-end gap-4 md:gap-6">
          <h2
            id="integration-overview-title"
            className="md:col-span-6 font-bold leading-tight text-slate-900
                       text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight"
          >
            What Data Integration{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Delivers
            </span>
          </h2>

          <p className="md:col-span-6 text-base md:text-lg text-slate-600">
            We wrap your existing datasets with EcoFocus sustainability intelligence—turning isolated KPIs into
            rich, purpose-driven insight. Instead of guessing why behavior shifts, you see the attitudes,
            expectations, and trust signals shaping every result.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="relative h-full rounded-3xl bg-white ring-1 ring-slate-100
                         shadow-[0_18px_40px_-22px_rgba(15,23,42,0.45)] px-6 py-7"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${pillar.iconBg}`}
              >
                {pillar.icon}
              </div>
              <h3 className="text-[18px] md:text-[19px] font-semibold leading-snug text-slate-900">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

