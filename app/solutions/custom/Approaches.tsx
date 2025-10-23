'use client';

const items = [
  {
    title: 'Quantitative Surveys',
    body: 'Custom questionnaires aligned to your goals, with robust sampling and clean, crosstab-ready outputs.',
  },
  {
    title: 'Qualitative Depth',
    body: 'Interviews, mini-groups, or communities to explore motivations, language, and message resonance.',
  },
  {
    title: 'Hybrid Designs',
    body: 'Quant + qual sequencing to size impact and explain the why behind behavior.',
  },
  {
    title: 'Embedded Constructs',
    body: 'Proven EcoFocus sustainability measures for claims, packaging, and trust—mapped to your categories.',
  },
];

export default function Approaches() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="custom-approaches">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="custom-approaches" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          Research Approaches
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => (
            <div key={x.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">{x.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{x.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

  