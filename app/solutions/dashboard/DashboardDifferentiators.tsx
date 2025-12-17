'use client';

const items = [
  {
    title: 'Ask Your Own Questions',
    body:
      'Explore tens of thousands of sustainability data points and test hypotheses in real time — without waiting for a new report.',
  },
  {
    title: 'De-Risk Messaging',
    body:
      'Validate which sustainability claims build trust, drive purchase intent, and reduce churn before going to market.',
  },
  {
    title: 'Track Change Over Time',
    body:
      'Identify real shifts in attitudes and behaviors using more than a decade of trend data.',
  },
];

export default function DashboardDifferentiators() {
  return (
    <section className="py-24 px-6 bg-ef-deepgreen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/10 bg-black/20 backdrop-blur p-8"
          >
            <h3 className="text-xl font-medium mb-3">{item.title}</h3>
            <p className="text-white/75 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
