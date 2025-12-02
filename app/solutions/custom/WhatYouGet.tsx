export default function WhatYouGet() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Deliverables
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            What you receive with every custom study.
          </h3>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            Our goal is to provide clear, evidence-backed answers and the tools
            to explore your data long after delivery. Each custom engagement
            includes a robust set of insights and assets designed for leadership
            alignment.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DeliverableCard
            title="Custom research instrument"
            body="A survey, interview guide, or hybrid design tailored to your questions."
          />
          <DeliverableCard
            title="Insights report"
            body="A narrative-driven report with key takeaways, visualizations, and recommended actions."
          />
          <DeliverableCard
            title="Syndicated data integration"
            body="Trend context from our 4,000-respondent annual study woven directly into your results."
          />
          <DeliverableCard
            title="Custom interactive dashboard"
            body="Full access to explore your proprietary results via filters, crosstabs, and segmentation tools."
          />
          <DeliverableCard
            title="Review session with experts"
            body="A deep-dive insights walkthrough with our research team to ensure alignment and clarity."
          />
          <DeliverableCard
            title="Ongoing advisory available"
            body="Optional consulting to support messaging, packaging, stakeholder storytelling, or EVP activation."
          />
        </div>
      </div>
    </section>
  );
}

function DeliverableCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm transition hover:border-emerald-400/70 hover:shadow-emerald-500/25">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-3 text-xs text-slate-300 sm:text-sm">{body}</p>
    </div>
  );
}

