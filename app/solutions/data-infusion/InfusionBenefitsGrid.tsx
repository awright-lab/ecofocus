'use client';

const items = [
  {
    title: 'Richer Personas & Journeys',
    body: 'Layer sustainability attitudes on top of your segments to see what truly motivates switching and loyalty.',
  },
  {
    title: 'De-risked Messaging & Claims',
    body: 'Know which claims resonate (and which sound like greenwashing) across cohorts and regions.',
  },
  {
    title: 'Pricing & Packaging Context',
    body: 'Understand willingness-to-pay and which on-pack signals build trust and trial.',
  },
  {
    title: 'Faster, Defensible Decisions',
    body: 'Bring 13 years of consistent, census-balanced study design to internal debates and stakeholder alignment.',
  },
];

export default function InfusionBenefitsGrid() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="infusion-benefits">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="infusion-benefits" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          What Data Infusion Unlocks
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
