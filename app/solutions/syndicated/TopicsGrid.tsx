'use client';

import { CloudSun, Recycle, HeartPulse, Shield, FlaskConical, PackageSearch } from 'lucide-react';

const topics = [
  {
    icon: <CloudSun className="w-6 h-6 text-emerald-600" />,
    title: 'Climate & Environment',
    description:
      'Climate change beliefs, extreme weather experiences, and attitudes toward emissions and fossil fuel extraction.',
  },
  {
    icon: <FlaskConical className="w-6 h-6 text-emerald-600" />,
    title: 'Chemical Safety',
    description:
      'Awareness and avoidance of BPA, phthalates, PFAS, VOCs, microplastics—across food, personal care, and home.',
  },
  {
    icon: <Recycle className="w-6 h-6 text-emerald-600" />,
    title: 'Circularity Behaviors',
    description:
      'Recycling, composting, waste reduction, and preferences for reusable, refillable, and recyclable packaging.',
  },
  {
    icon: <PackageSearch className="w-6 h-6 text-emerald-600" />,
    title: 'Sustainable Consumption',
    description:
      'Willingness to pay, organic/local buying, and the role of certifications in building consumer trust.',
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-600" />,
    title: 'Corporate Responsibility',
    description:
      'Expectations for commitments, transparency, and accountability (e.g., Extended Producer Responsibility).',
  },
  {
    icon: <HeartPulse className="w-6 h-6 text-emerald-600" />,
    title: 'Health–Environment Link',
    description:
      'How personal wellness and environmental stewardship connect in choices about materials, ingredients, and labels.',
  },
];

export default function TopicsGrid() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="topics-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="topics-grid" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          How We Measure Sustainability
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-gray-600">
          Our view spans environmental and health dimensions that shape real-world choices.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <div key={t.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3">{t.icon}</div>
              <h3 className="font-semibold text-gray-900">{t.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

