// components/solutions/custom/Deliverables.tsx
import Link from 'next/link'

export default function Deliverables() {
  const cards = [
    {
      title: 'Executive Story Decks',
      desc: 'Clear narrative with implications for marketing, product, and sustainability teams.',
    },
    {
      title: 'Exportable Crosstabs',
      desc: 'Ready-to-share tables aligned to your priorities—no manual slicing required.',
    },
    {
      title: 'Optional Dashboard Access',
      desc: 'Explore trends in our web platform. Filter by audience and export visuals.',
      cta: { href: '/dashboard', label: 'Explore the Dashboard →' },
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h2 className="text-xl font-semibold text-gray-900">Deliverables you can act on</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((d) => (
          <div key={d.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{d.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{d.desc}</p>
            {'cta' in d && d.cta ? (
              <div className="mt-3">
                <Link href={d.cta.href} className="text-sm font-semibold text-emerald-700 hover:underline">
                  {d.cta.label}
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
