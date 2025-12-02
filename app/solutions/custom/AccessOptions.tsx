export default function AccessOptions() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Flexible Options
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Custom research for every budget and objective.
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Option 1 */}
          <OptionCard
            title="Full Custom Study"
            body="A bespoke quantitative or qualitative study built specifically for your audience, your category, and your sustainability objectives."
            badge="Most popular"
          />

          {/* Option 2 */}
          <OptionCard
            title="Custom Questions in the Annual Syndicated Study"
            body="Add proprietary questions to our 4,000-person study—an extremely cost-efficient option that reduces bias and provides rich trend context."
          />

          {/* Option 3 */}
          <OptionCard
            title="Mini Insights Placement"
            body="Limited-space inclusion for smaller brands: receive free insights on awareness, behavior, intent, and sustainability perception."
          />
        </div>
      </div>
    </section>
  );
}

function OptionCard({
  title,
  body,
  badge,
}: {
  title: string;
  body: string;
  badge?: string;
}) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm transition hover:border-emerald-400/70 hover:shadow-emerald-500/25">
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
          {badge}
        </span>
      )}

      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-3 text-xs text-slate-300 sm:text-sm">{body}</p>
    </div>
  );
}
