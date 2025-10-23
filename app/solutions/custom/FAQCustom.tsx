'use client';

const faqs = [
  {
    q: 'Do you handle both B2B and B2C?',
    a: 'Yes. We scope audiences and methods to your market and objectives.',
  },
  {
    q: 'Can we include proprietary questions?',
    a: 'Absolutely. We design instruments around your priorities and can include EcoFocus constructs for comparability.',
  },
  {
    q: 'How are timelines managed?',
    a: 'We build a phased plan with milestones for instrument, fieldwork, analysis, and readouts.',
  },
  {
    q: 'Will we get a dashboard?',
    a: 'Dashboards are optional. We can deliver crosstabs, exports, and a custom dashboard if ongoing access is needed.',
  },
];

export default function CustomFAQ() {
  return (
    <section className="relative bg-white" aria-labelledby="custom-faq">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2
          id="custom-faq"
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]"
        >
          Custom Studies FAQs
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

