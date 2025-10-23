'use client';

import { Briefcase, Users, ShoppingBasket, Landmark } from 'lucide-react';

const useCases = [
  {
    icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
    title: 'For CMOs',
    points: [
      'Translate sustainability into growth with data-backed message and claim testing.',
      'Know which levers drive switching, loyalty, and price tolerance.',
    ],
  },
  {
    icon: <Users className="w-6 h-6 text-emerald-600" />,
    title: 'For CHROs & Talent',
    points: [
      'Link employer brand to the values that matter to emerging talent.',
      'Back your EVP with real data to reduce churn and boost attraction.',
    ],
  },
  {
    icon: <ShoppingBasket className="w-6 h-6 text-emerald-600" />,
    title: 'Retail & Grocery',
    points: [
      'Choose the right on-pack claims and signage for shopper values by region.',
      'Align private label and vendor messaging to demand signals.',
    ],
  },
  {
    icon: <Landmark className="w-6 h-6 text-emerald-600" />,
    title: 'Financial Services',
    points: [
      'Understand which sustainability themes build trust with younger customers.',
      'Validate ESG product narratives and avoid greenwashing.',
    ],
  },
];

export default function UseCasesGrid() {
  return (
    <section className="relative bg-white" aria-labelledby="use-cases-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="use-cases-grid" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          Use Cases Across the Business
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u) => (
            <div key={u.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-2">{u.icon}</div>
              <h3 className="font-semibold text-gray-900">{u.title}</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
                {u.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

