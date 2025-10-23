'use client';

const groups = [
  {
    title: 'Brand & Innovation',
    points: [
      'Concept and claim testing',
      'Category and whitespace mapping',
      'Persona and journey development',
    ],
  },
  {
    title: 'Talent & Culture',
    points: [
      'EVP validation and message alignment',
      'Values-driven retention insights',
    ],
  },
  {
    title: 'Retail & Shopper',
    points: [
      'On-pack signals and signage effectiveness',
      'Private label positioning and assortment',
    ],
  },
  {
    title: 'Financial Services',
    points: [
      'ESG narrative testing and trust themes',
      'Younger customer acquisition drivers',
    ],
  },
];

export default function CustomUseCasesGrid() {
  return (
    <section className="relative bg-white" aria-labelledby="custom-use-cases">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="custom-use-cases" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
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
