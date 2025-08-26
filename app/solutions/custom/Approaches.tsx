// components/solutions/custom/Approaches.tsx
export default function Approaches() {
    const cols = [
      {
        title: 'Quantitative',
        points: ['Concept, claims & pack tests', 'Conjoint / MaxDiff', 'TURF & feature prioritization', 'Market sizing & incidence'],
      },
      {
        title: 'Qualitative',
        points: ['1:1 depth interviews', 'Mini-groups & co-creation', 'In-home & shop-along', 'Usability / diary studies'],
      },
      {
        title: 'Mixed Methods',
        points: ['Segmentation builds & refreshes', 'Journey mapping', 'Attitude-behavior linkage', 'Price & value perception'],
      },
    ]
  
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="text-xl font-semibold text-gray-900">Approaches we use</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {cols.map((col) => (
            <div key={col.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{col.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {col.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )
  }
  