export default function SnapshotPreview() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Sample Insights
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            What a custom study can reveal.
          </h3>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            Every custom engagement produces its own story, but the themes below
            represent the types of clarity our clients gain when we analyze
            audience-specific sustainability expectations.
          </p>
        </div>

        {/* Snapshot cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SnapshotCard
            headline="Claim clarity"
            body="Which sustainability phrases increase purchase intent—and which trigger skepticism or greenwashing alarms."
          />
          <SnapshotCard
            headline="Packaging impact"
            body="How material, recyclability, and design choices influence pickup, trust, and brand preference."
          />
          <SnapshotCard
            headline="Employee sentiment"
            body="Which sustainability commitments matter most to your workforce and how they shape EVP perception."
          />
          <SnapshotCard
            headline="Regional priorities"
            body="How sustainability expectations shift between suburban, rural, and urban shoppers."
          />
          <SnapshotCard
            headline="Brand trust signals"
            body="Which certifications, claims, or actions meaningfully strengthen perceived authenticity."
          />
          <SnapshotCard
            headline="Concept validation"
            body="How new product ideas or messaging resonate before you invest in launch."
          />
        </div>
      </div>
    </section>
  );
}

function SnapshotCard({
  headline,
  body,
}: {
  headline: string;
  body: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm shadow-slate-900/60 transition hover:border-emerald-400/70 hover:shadow-emerald-500/25">
      <h4 className="text-sm font-semibold text-white">{headline}</h4>
      <p className="mt-3 text-xs text-slate-300 sm:text-sm">{body}</p>
      <div className="mt-4 flex items-center text-xs font-medium text-emerald-300 opacity-0 transition group-hover:opacity-100">
        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        Based on your objectives.
      </div>
    </div>
  );
}
