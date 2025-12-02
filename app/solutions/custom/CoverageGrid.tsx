const INDUSTRIES = [
  "Consumer Packaged Goods (CPG)",
  "Retail & Grocery",
  "Financial Services & ESG Product Teams",
  "HR, Talent & Employer Branding",
  "Food & Beverage",
  "Private Equity & Portfolio Companies",
  "Health, Beauty & Personal Care",
  "Sustainability & Corporate Responsibility Teams",
];

export default function CoverageGrid() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Who We Support
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Custom research designed for your industry.
          </h3>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            Whether you’re validating packaging claims, rethinking ESG
            messaging, building workforce alignment, or uncovering new growth
            opportunities, we design research tailored to the realities of your
            market.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <div
              key={industry}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-900/60"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"></span>
                <span>{industry}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
