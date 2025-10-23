'use client';

export default function CustomMethodsStripe() {
  const stats = [
    { label: 'Quant & Qual Toolbox', value: 'Hybrid' },
    { label: 'Sampling', value: 'Aligned to your audiences' },
    { label: 'Quality', value: 'Rigorous controls & checks' },
    { label: 'Outputs', value: 'Executive-ready & crosstabbed' },
  ];

  return (
    <section className="relative section-slab-emerald">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 text-white">
        <h2 className="text-center font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.2rem)]">
          Methodology You Can Defend
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-white/85">
          We recommend the right approach—quantitative, qualitative, or hybrid—based on your questions, KPIs, and timeline.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm opacity-90">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

