'use client';

const steps = [
  {
    title: '1) Align Objectives',
    body: 'No-cost discovery to clarify decisions, KPIs, audiences, and timelines.',
  },
  {
    title: '2) Data Mapping',
    body: 'We map your segments, attributes, and measures to EcoFocus constructs.',
  },
  {
    title: '3) Infuse & Merge',
    body: 'We enrich your dataset with sustainability attitudes, behaviors, and topics that matter.',
  },
  {
    title: '4) Analyze & Validate',
    body: 'Joint readouts surface insights, risks, and growth levers for your roadmap.',
  },
  {
    title: '5) Activate',
    body: 'Executive summary, claims guidance, and dashboard access for ongoing exploration.',
  },
];

export default function InfusionWorkflowSteps() {
  return (
    <section className="relative bg-white" aria-labelledby="infusion-workflow">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="infusion-workflow" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          How It Works
        </h2>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <li key={s.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
