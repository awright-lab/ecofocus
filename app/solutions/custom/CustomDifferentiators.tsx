// app/solutions/custom/CustomDifferentiators.tsx
'use client';

export default function CustomDifferentiators() {
  const items = [
    {
      title: 'Grounded in 13+ Years of Trend',
      body:
        'Your custom work can tie back to EcoFocus trendlines, so today’s decisions fit into a longer-term sustainability story.',
    },
    {
      title: 'Purpose + Behavior, Not Just Opinions',
      body:
        'We connect beliefs and values to concrete behaviors, category choices, and pack/claim preferences.',
    },
    {
      title: 'Built for CMOs, CHROs & ESG Leaders',
      body:
        'Outputs are designed to move decision-makers, not just fill a deck—clear implications, next steps, and activation ideas.',
    },
  ];

  return (
    <section
      className="relative bg-gray-50"
      aria-labelledby="custom-diff"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2
          id="custom-diff"
          className="text-center font-bold text-slate-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Why EcoFocus for Custom Work
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{d.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
