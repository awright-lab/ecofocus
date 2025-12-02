const TOPICS = [
  "Sustainability messaging & claims testing",
  "Packaging perceptions & material preferences",
  "Chemical safety concerns (PFAS, BPA, VOCs, microplastics)",
  "Willingness to pay for sustainable attributes",
  "Corporate responsibility & ESG expectations",
  "Recycling, reuse & circular behavior patterns",
  "Brand trust & green credibility signals",
  "Workforce sustainability attitudes (EVP alignment)",
  "Product concept testing & innovation insights",
  "Regional sustainability priorities",
  "Greenwashing sensitivity & message credibility",
];

export default function TopicsGrid() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Topics We Explore
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Insights aligned to your sustainability priorities.
          </h3>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            If sustainability plays a role in how your customers or employees
            make decisions, we can measure it. Our custom studies dive deep into
            the behaviors, beliefs, and expectations driving the
            Purpose-Driven Generation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic) => (
            <div
              key={topic}
              className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm shadow-slate-900/60 transition hover:border-emerald-400/70 hover:shadow-emerald-500/25"
            >
              <h4 className="text-sm font-semibold text-white">{topic}</h4>
              <div className="mt-3 flex items-center text-xs font-medium text-emerald-300 opacity-0 transition group-hover:opacity-100">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Included in custom scoping.
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
