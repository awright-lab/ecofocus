const USE_CASES = [
  {
    title: "CPG & Brand Marketing",
    body: "Validate packaging, claims, sustainability messaging, and innovation concepts before you invest in rollout.",
  },
  {
    title: "Retail & Grocery",
    body: "Align private label and category strategy with shopper values, regional sustainability priorities, and shelf-level decision drivers.",
  },
  {
    title: "HR & Talent Leaders",
    body: "Measure how sustainability commitments influence talent attraction, retention, and internal engagement across generations.",
  },
  {
    title: "Financial Services & ESG",
    body: "Understand which climate or ESG signals build trust—and which claims create skepticism—among account holders and investors.",
  },
  {
    title: "Private Equity & Portfolio",
    body: "Use sustainability insights to validate brand positioning, reduce messaging risk, and enhance portfolio value.",
  },
  {
    title: "Corporate Responsibility",
    body: "Evaluate the credibility and impact of your sustainability initiatives with the audiences who matter most.",
  },
];

export default function UseCasesGrid() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Use Cases
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            How organizations use custom research.
          </h3>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            EcoFocus Custom Studies are built for leaders across industries who
            need evidence-backed clarity on sustainability-driven decisions—from
            packaging to workforce sentiment to ESG narratives.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm transition hover:border-emerald-400/70 hover:shadow-emerald-500/20"
            >
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              <p className="mt-3 text-xs text-slate-300 sm:text-sm">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
