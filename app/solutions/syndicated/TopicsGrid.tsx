'use client';

import { CloudSun, Recycle, HeartPulse, Shield, FlaskConical, PackageSearch } from 'lucide-react';
import { type ComponentType } from 'react';

type Topic = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const topics: Topic[] = [
  {
    icon: CloudSun,
    title: 'Climate & Environment',
    description:
      'Climate change beliefs, extreme weather experiences, and attitudes toward emissions and fossil fuel extraction.',
  },
  {
    icon: FlaskConical,
    title: 'Chemical Safety',
    description:
      'Awareness and avoidance of BPA, phthalates, PFAS, VOCs, microplastics—across food, personal care, and home.',
  },
  {
    icon: Recycle,
    title: 'Circularity Behaviors',
    description:
      'Recycling, composting, waste reduction, and preferences for reusable, refillable, and recyclable packaging.',
  },
  {
    icon: PackageSearch,
    title: 'Sustainable Consumption',
    description:
      'Willingness to pay, organic/local buying, and the role of certifications in building consumer trust.',
  },
  {
    icon: Shield,
    title: 'Corporate Responsibility',
    description:
      'Expectations for commitments, transparency, and accountability (e.g., Extended Producer Responsibility).',
  },
  {
    icon: HeartPulse,
    title: 'Health–Environment Link',
    description:
      'How personal wellness and environmental stewardship connect in choices about materials, ingredients, and labels.',
  },
];

export default function TopicsGrid() {
  return (
    <section className="relative bg-slate-900" aria-labelledby="topics-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <h2
          id="topics-grid"
          className="text-center font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.3rem)]"
        >
          How We Measure <span className="text-emerald-400">Sustainability</span>
        </h2>

        {/* accent bar under heading */}
        <div className="mx-auto mt-3 h-[3px] w-20 rounded-full bg-emerald-500" />

        <p className="mx-auto mt-5 max-w-3xl text-center text-slate-300">
          Our view spans environmental and health dimensions that shape real-world choices.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="
                group rounded-2xl bg-slate-800/80 p-6
                ring-1 ring-white/10 shadow-sm
                hover:ring-emerald-400 hover:shadow-md transition-all duration-200
              "
            >
              {/* icon block */}
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-300">{description}</p>

              {/* bottom accent bar */}
              <div className="mt-6 h-[4px] w-full rounded-b-2xl bg-slate-700 group-hover:bg-emerald-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



