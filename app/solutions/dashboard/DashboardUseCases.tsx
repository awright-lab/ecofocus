'use client';

const audiences = [
  {
    title: 'CMOs & Brand Leaders',
    body:
      'Turn purpose into pricing power by validating claims that drive loyalty and reduce churn.',
  },
  {
    title: 'CHROs & Talent Leaders',
    body:
      'Align employer branding with workforce values to attract, retain, and motivate talent.',
  },
  {
    title: 'Retail & Category Leaders',
    body:
      'Guide shelf messaging, private-label claims, and assortment strategy with shopper data.',
  },
  {
    title: 'Financial & Private Equity Teams',
    body:
      'Test ESG narratives, reduce greenwashing risk, and build trust with values-driven customers.',
  },
];

export default function DashboardUseCases() {
  return (
    <section className="py-28 px-6 bg-ef-charcoal">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-light text-center mb-14">
          Built for Decision-Makers
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {audiences.map((a) => (
            <div key={a.title} className="border-l border-ef-sage pl-6">
              <h3 className="text-xl mb-2">{a.title}</h3>
              <p className="text-white/70 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
