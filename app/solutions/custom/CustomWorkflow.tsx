'use client';

const steps = [
  { title: '1) Discovery & Scope', body: 'No-cost consultation to clarify decisions, timelines, audiences, and success criteria.' },
  { title: '2) Design', body: 'Method selection, instrument drafting, sample plan, and fieldwork logistics aligned to your KPIs.' },
  { title: '3) Fieldwork', body: 'Qual sessions and/or survey fielding with quality controls and status transparency.' },
  { title: '4) Analysis & Readout', body: 'Executive-ready narrative, visualization, and recommendations tied to business impact.' },
  { title: '5) Activation', body: 'Optional dashboard, enablement workshops, and ongoing consulting as needed.' },
];

export default function CustomWorkflow() {
  return (
    <section className="relative bg-white" aria-labelledby="custom-workflow">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="custom-workflow" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          How We Work
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
