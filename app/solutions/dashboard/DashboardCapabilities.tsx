'use client';

const capabilities = [
  {
    title: 'Message & Claim Testing',
    body:
      'Compare sustainability language like “Plastic-Free” versus “Carbon Neutral” to see what actually changes behavior.',
  },
  {
    title: 'Crosstab & Segmentation',
    body:
      'Analyze responses by demographics, psychographics, attitudes, behaviors, and values-based segments.',
  },
  {
    title: 'Behavioral Profiles',
    body:
      'Move beyond who your audience is into what motivates them — and why.',
  },
  {
    title: 'Trend Analysis',
    body:
      'Spot emerging shifts early and validate whether change is meaningful or just noise.',
  },
];

export default function DashboardCapabilities() {
  return (
    <section className="py-28 px-6 bg-ef-charcoal">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-light text-center mb-14">
          What You Can Do Inside the Dashboard
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {capabilities.map((cap) => (
            <div key={cap.title}>
              <h3 className="text-2xl mb-2">{cap.title}</h3>
              <p className="text-white/75 leading-relaxed">{cap.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
