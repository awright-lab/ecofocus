// components/solutions/custom/WhyCustom.tsx
export default function WhyCustom() {
    const items = [
      {
        title: 'Built for your category',
        desc: 'Sampling, language, and hypotheses tuned to your buyers and channels—food & bev, household, personal care, and more.',
      },
      {
        title: 'Faster path to clarity',
        desc: 'Right-sized designs with stakeholder-ready outputs—get to a decision without bloat or months of delay.',
      },
      {
        title: 'Methods that fit',
        desc: 'Conjoint/MaxDiff, concept & claims tests, segmentation refreshes, qual depths & mini-groups—mixed methods when it matters.',
      },
    ]
  
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Why Custom Research?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((c) => (
            <div key={c.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  