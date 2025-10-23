'use client';

const groups = [
  {
    title: 'Brand & Growth',
    points: [
      'Personas with sustainability drivers',
      'Claim and packaging validation',
      'Price and value sensitivity',
    ],
  },
  {
    title: 'Talent & Culture',
    points: [
      'EVP alignment with Generation Z and Millennials',
      'Internal messaging that retains values-driven talent',
    ],
  },
  {
    title: 'Retail & Shopper',
    points: [
      'Regionalized signage and on-pack signals',
      'Private label positioning that matches shopper priorities',
    ],
  },
  {
    title: 'Financial Services',
    points: [
      'ESG narrative validation for younger account holders',
      'Trust-building themes that avoid greenwashing',
    ],
  },
];

export default function InfusionUseCasesGrid() {
  return (
    <section className="relative bg-white" aria-labelledby="infusion-use-cases">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="infusion-use-cases" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          Use Cases Across the Business
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">{g.title}</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
                {g.points.map((p) => (
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
