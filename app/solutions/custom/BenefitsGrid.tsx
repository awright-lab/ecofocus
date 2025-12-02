const BENEFITS = [
  {
    title: "Reduce messaging risk",
    body: "Test sustainability claims, language, and proof points so you avoid vague promises that read as greenwashing.",
  },
  {
    title: "Validate packaging & product decisions",
    body: "Understand which materials, certifications, and on-pack messages increase pickup, purchase intent, and brand trust.",
  },
  {
    title: "Strengthen your employer value proposition",
    body: "Measure how sustainability commitments influence talent attraction, retention, and internal engagement—especially for younger workers.",
  },
  {
    title: "Build richer, sustainability-led personas",
    body: "Layer attitudes, behaviors, and demographics into profiles that reflect how eco-minded your key segments truly are.",
  },
  {
    title: "Inform go-to-market and channel strategy",
    body: "Learn which sustainability themes resonate by region, life stage, or channel to sharpen campaigns and retail execution.",
  },
  {
    title: "Turn purpose into measurable growth",
    body: "Link purpose and sustainability initiatives to behaviors that matter: trial, loyalty, advocacy, and reduced churn.",
  },
];

export default function BenefitsGrid() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Benefits
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            What a custom EcoFocus study delivers.
          </h3>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            Custom studies are designed to answer the questions that
            syndicated data can&apos;t solve on its own. Our goal is to give
            you a clear line of sight from{" "}
            <span className="font-semibold text-emerald-200">
              sustainability insight to business decision
            </span>
            .
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm shadow-slate-900/60 transition hover:border-emerald-400/70 hover:shadow-emerald-500/25"
            >
              <div>
                <h4 className="text-sm font-semibold text-white sm:text-base">
                  {benefit.title}
                </h4>
                <p className="mt-3 text-xs text-slate-300 sm:text-sm">
                  {benefit.body}
                </p>
              </div>

              <div className="mt-4 flex items-center text-xs font-medium text-emerald-300 opacity-0 transition group-hover:opacity-100">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Insight you can act on.
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
