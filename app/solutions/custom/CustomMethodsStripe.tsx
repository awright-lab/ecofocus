export default function CustomMethodologyStripe() {
  return (
    <section className="relative border-y border-slate-800 bg-slate-900/40 py-14 sm:py-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Methodology
        </h2>

        <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Research tailored to your exact questions.
        </h3>

        <p className="mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
          Custom studies use a flexible mix of qualitative and quantitative
          methods. We recommend the right design based on your objectives,
          audience, and the decisions you need to make. Every project is built
          on our sustainability expertise and anchored in 13+ years of trend
          data.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MethodCard
            title="Quantitative surveys"
            body="National or targeted samples designed to measure attitudes, behaviors, and response to sustainability signals."
          />
          <MethodCard
            title="Qualitative interviews"
            body="One-on-one discussions with consumers, employees, or stakeholders to uncover deeper motivations."
          />
          <MethodCard
            title="Message & packaging testing"
            body="A/B or multi-cell testing to evaluate claims, designs, materials, and ESG narratives."
          />
          <MethodCard
            title="Concept validation"
            body="Early-stage or pre-launch evaluation of new products or sustainable innovation ideas."
          />
          <MethodCard
            title="Persona & segmentation work"
            body="Build sustainability-led personas that reflect attitudes, trust cues, and behaviors."
          />
          <MethodCard
            title="EVP & workforce studies"
            body="Understand how sustainability impacts talent attraction, retention, and employee alignment."
          />
        </div>
      </div>
    </section>
  );
}

function MethodCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-sm transition hover:border-emerald-300/70">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-3 text-xs text-slate-300 sm:text-sm">{body}</p>
    </div>
  );
}


