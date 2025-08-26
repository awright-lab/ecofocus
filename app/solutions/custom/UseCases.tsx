// components/solutions/custom/UseCases.tsx
export default function UseCases() {
    const items = [
      {
        title: 'Marketing & Brand',
        desc: 'Positioning, message & claims, green equity tracking, whitespace opportunity validation.',
      },
      {
        title: 'Product & Innovation',
        desc: 'Concept prioritization, feature trade-offs, pack/label tests, and category-specific purchase drivers.',
      },
      {
        title: 'ESG & Investor',
        desc: 'Data-backed narratives that connect consumer priorities with environmental impact goals.',
      },
    ]
  
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="text-xl font-semibold text-gray-900">Where Custom Research shines</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((u) => (
            <div key={u.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{u.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  