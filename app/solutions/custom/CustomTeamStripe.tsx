'use client';

export default function CustomTeamStripe() {
  const bios = [
    {
      name: 'Elinor Gaida',
      role: 'VP, Research & Strategy',
      blurb:
        '20 years guiding businesses through critical questions with qual/quant expertise across retail, telecom, and tech.',
    },
    {
      name: 'Allison Duncan',
      role: 'Director, Research & Insights',
      blurb:
        'Client- and vendor-side experience in B2B research and comprehensive project management across CPG and Pharma.',
    },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="custom-team">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="custom-team" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]">
          Your Research Experts
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {bios.map((b) => (
            <div key={b.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-gray-900">{b.name}</div>
              <div className="text-sm text-emerald-700 font-medium">{b.role}</div>
              <p className="mt-2 text-sm text-gray-600">{b.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
