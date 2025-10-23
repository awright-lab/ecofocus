'use client';

const cols = [
  {
    title: 'Executive Summary',
    lines: [
      'Key findings with a clear storyline',
      'Implications and recommendations',
      'Appendix with methods detail',
    ],
  },
  {
    title: 'Data & Visualization',
    lines: [
      'Crosstabs and exports',
      'Dashboards (optional) for ongoing exploration',
      'Figures suitable for stakeholder share-outs',
    ],
  },
  {
    title: 'Enablement',
    lines: [
      'Team readouts and Q&A',
      'Claim and packaging guidance',
      'Workshops or consulting as needed',
    ],
  },
];

export default function Deliverables() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="custom-deliverables">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="custom-deliverables" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
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

