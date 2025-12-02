const DIFFERENTIATORS = [
  {
    title: "Built by sustainability specialists",
    body: "We focus exclusively on sustainability attitudes & behaviors — making us uniquely qualified to design research in this space.",
  },
  {
    title: "Backed by a massive trend engine",
    body: "Your custom results are interpreted alongside 13+ years of syndicated data from 4,000 U.S. adults.",
  },
  {
    title: "Actionable, not academic",
    body: "We tie insights directly to messaging, packaging, EVP, and go-to-market decisions you can use immediately.",
  },
  {
    title: "White-glove research expertise",
    body: "Our team works with you from question design to insights delivery, ensuring every study answers the right question.",
  },
  {
    title: "More affordable than big-firm research",
    body: "You get clarity comparable to McKinsey or Ipsos — without their overhead or timelines.",
  },
  {
    title: "Flexible B2C & B2B experience",
    body: "From consumers and shoppers to employees and account holders, we research audiences at every level.",
  },
];

export default function CustomDifferentiators() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Why EcoFocus
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            What makes our custom research different?
          </h3>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            When you need sustainability-specific insights, generic research
            vendors fall short. EcoFocus is built from the ground up to answer
            questions about environmental values, health concerns, and purpose-
            driven behaviors — and how they shape decisions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIATORS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm shadow-slate-900/60 transition hover:border-emerald-400/70 hover:shadow-emerald-500/25"
            >
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {item.title}
                </h4>
                <p className="mt-3 text-xs text-slate-300 sm:text-sm">
                  {item.body}
                </p>
              </div>

              <div className="mt-4 flex items-center text-xs font-medium text-emerald-300 opacity-0 transition group-hover:opacity-100">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Custom-built for sustainability.
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

