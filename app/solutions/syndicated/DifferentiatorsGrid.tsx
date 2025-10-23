'use client';

export default function DifferentiatorsGrid() {
  const items = [
    {
      title: 'Landing Zone → Launching Pad',
      body:
        'Most needs are solved by our deep syndicated database. If you need more, we extend into bespoke research seamlessly.',
    },
    {
      title: 'De-Risk Your Messaging',
      body:
        'Test which claims resonate and avoid vague language that triggers skepticism. Communicate with confidence.',
    },
    {
      title: 'Purpose Behavior Engine',
      body:
        'Behavioral baseline, psychographic & demographic profiles, message resonance, and packaging/label influence—built for CMOs.',
    },
  ];

  return (
    <section className="relative bg-gray-50" aria-labelledby="diff-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="diff-grid" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          What Makes EcoFocus Different
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div key={d.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">{d.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

