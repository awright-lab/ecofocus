'use client';

import { Briefcase, Users, ShoppingBasket, Landmark } from 'lucide-react';

const useCases = [
  {
    icon: Briefcase,
    title: 'Brand & Innovation Teams',
    points: [
      'Clarify demand spaces and territories for product, pack, and portfolio innovation.',
      'Prioritize where sustainability can stretch your brand versus where it should follow.',
    ],
  },
  {
    icon: Users,
    title: 'Insights & Strategy',
    points: [
      'Build a sustainability POV that ladders into your broader consumer segmentation.',
      'Connect the dots between existing tracking, sales, and EcoFocus data.',
    ],
  },
  {
    icon: ShoppingBasket,
    title: 'Retail & Shopper',
    points: [
      'Co-author custom work with retail partners around category vision and aisle strategy.',
      'Test signage, shelf sets, and claims in the context of your key banners.',
    ],
  },
  {
    icon: Landmark,
    title: 'Corporate Affairs & ESG',
    points: [
      'Validate ESG narratives and commitments with the consumers they are meant to serve.',
      'Equip leadership with credible, consumer-backed proof for external storytelling.',
    ],
  },
];

export default function CustomUseCasesGrid() {
  return (
    <section className="relative bg-white" aria-labelledby="custom-use-cases">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-18">
        <h2
          id="custom-use-cases"
          className="text-center font-bold text-slate-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Use Cases Across the Business
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-slate-600 text-sm sm:text-base">
          Custom studies give each stakeholder a way into the data—without creating disconnected
          pockets of insight.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u) => (
            <div
              key={u.title}
              className="relative p-[1px] rounded-[1.05rem]
                         bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]"
            >
              <article className="h-full rounded-[1rem] bg-white ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)] flex flex-col">
                <div className="px-6 pt-6 pb-4">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <u.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-semibold tracking-tight text-slate-900 leading-snug">
                    {u.title}
                  </h3>
                </div>
                <div className="px-6 pb-6">
                  <ul className="space-y-1.5 text-[14px] text-slate-700 list-disc pl-5">
                    {u.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


