const FAQ_ITEMS = [
  {
    q: "Do you conduct both B2C and B2B custom studies?",
    a: "Yes. We design custom research for consumers, shoppers, employees, job seekers, account holders, and other stakeholders.",
  },
  {
    q: "Are custom studies quantitative or qualitative?",
    a: "Both. We recommend the right methodological mix based on your questions, budget, and timeline.",
  },
  {
    q: "How long does a custom project typically take?",
    a: "Most studies take 4–8 weeks, depending on complexity, audience, and scope.",
  },
  {
    q: "Do I get access to the interactive dashboard?",
    a: "Yes. Every custom study includes a dedicated dashboard at no additional cost for 24/7 exploration.",
  },
  {
    q: "Can you integrate our internal data?",
    a: "Absolutely. Many clients bring existing data for us to layer with our sustainability insights for deeper context.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          FAQ
        </h2>
        <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Frequently asked questions.
        </h3>

        <div className="mt-10 space-y-8">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.q}
              className="border-b border-slate-800 pb-6"
            >
              <h4 className="text-base font-semibold text-white">
                {item.q}
              </h4>
              <p className="mt-3 text-sm text-slate-300">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


