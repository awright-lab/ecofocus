'use client';

const faqs = [
  {
    q: 'Do you need our raw data?',
    a: 'We can work with aggregated outputs or securely handle raw files under NDA. We map your fields to EcoFocus constructs and return enriched views.',
  },
  {
    q: 'How do we avoid bias?',
    a: 'Infusion combines your dataset with a large, census-balanced study. It adds missing context and reduces the risk of overfitting to a narrow sample.',
  },
  {
    q: 'Can we add proprietary questions?',
    a: 'Yes. We can field proprietary questions in the next wave and deliver a custom dashboard that includes your proprietary data.',
  },
  {
    q: 'What is the timeline?',
    a: 'Discovery and mapping are fast. Infuse and merge depends on scope and file format. We align a phased plan during discovery.',
  },
];

export default function InfusionFAQ() {
  return (
    <section className="relative bg-white" aria-labelledby="infusion-faq">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="infusion-faq" className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]">
          Data Infusion FAQs
        </h2>

        <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {faqs.map((f) => (
            <div key={f.q} className="p-5">
              <div className="font-medium text-gray-900">{f.q}</div>
              <p className="mt-2 text-sm text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
