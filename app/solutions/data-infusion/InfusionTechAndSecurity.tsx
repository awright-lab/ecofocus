'use client';

export default function InfusionTechAndSecurity() {
  const rows = [
    { label: 'Data Handling', value: 'We work with anonymized, aggregated data or strict NDA where required.' },
    { label: 'PII', value: 'We do not require PII for infusion. If present, it remains siloed under your control.' },
    { label: 'Compliance', value: 'We align with client policies and follow industry best practices.' },
    { label: 'Delivery', value: 'Secure transfers, audit trail, and versioned outputs.' },
  ];

  return (
    <section className="relative bg-white" aria-labelledby="infusion-security">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <h2 id="infusion-security" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]">
          Tech & Security
        </h2>

        <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-[220px,1fr]">
              <div className="text-sm font-medium text-gray-700">{r.label}</div>
              <div className="text-sm text-gray-900">{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
