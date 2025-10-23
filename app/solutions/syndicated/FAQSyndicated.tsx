'use client';

const faqs = [
  {
    q: 'Is your data representative of the U.S. population?',
    a: 'Yes. We survey 4,000 U.S. adults (18+), balanced to key Census demographics for national representativeness.',
  },
  {
    q: 'What is the margin of error?',
    a: '±1.55% at the national level for n=4,000.',
  },
  {
    q: 'How do you conduct your surveys—and how in-depth are they?',
    a: 'Online surveys, ~20–25 minutes. Sample design and quotas ensure robust coverage across key segments.',
  },
  {
    q: 'Do you do B2B research as well as B2C?',
    a: 'Yes. Contact us to discuss audiences and scope.',
  },
  {
    q: 'Do you only do syndicated research?',
    a: 'No. We also run custom qualitative and quantitative projects (surveys, polls, special reports) and consulting.',
  },
  {
    q: 'Can your experts brief my team or speak at an event?',
    a: 'Yes—whether or not you have a subscription package.',
  },
];

export default function FAQSyndicated() {
  return (
    <section className="relative bg-white" aria-labelledby="syndicated-faq">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2
          id="syndicated-faq"
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]"
        >
          Syndicated Study FAQs
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





