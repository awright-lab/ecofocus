'use client';

const cols = [
  {
    title: 'Integrated Insight',
    lines: [
      'Executive summary with your data + EcoFocus context',
      'Persona and journey enrichment',
      'Message and claim guidance',
    ],
  },
  {
    title: 'Dashboard Access',
    lines: [
      'All syndicated modules',
      'Crosstabs and exports',
      'Team onboarding and support',
    ],
  },
  {
    title: 'Custom Options',
    lines: [
      'Proprietary questions in the next wave',
      'Custom dashboard with your proprietary data',
      'Readouts tailored to stakeholders',
    ],
  },
];

export default function InfusionDeliverables() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="infusion-deliverables">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="infusion-deliverables" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          Deliverables
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">{c.title}</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
                {c.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
