'use client';

export default function CoverageGrid() {
  const rows = [
    { label: 'Universe', value: 'U.S. Adults (18+), balanced to U.S. Census' },
    { label: 'N (Gen Pop)', value: 'n = 4,000' },
    { label: 'N (Grocery Shoppers)', value: 'n ≈ 3,900' },
    { label: 'Mode / Duration', value: 'Online / ~20-25 minutes' },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="coverage-grid">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2
          id="coverage-grid"
          className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]"
        >
          Background & Methodology Snapshot
        </h2>

        <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-[220px,1fr]">
              <div className="text-sm font-medium text-gray-700">{r.label}</div>
              <div className="text-sm text-gray-900">{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


