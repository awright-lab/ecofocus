// components/solutions/custom/Process.tsx
export default function Process() {
    const steps = [
      { n: 1, t: 'Scope', d: 'Align on objectives, audiences, and must-answer questions.' },
      { n: 2, t: 'Design', d: 'Right-sized instrument and plan; stakeholders onboarded.' },
      { n: 3, t: 'Field', d: 'Quality controls, progress check-ins, and early signal reads.' },
      { n: 4, t: 'Deliver', d: 'Decision-ready outputs with implications and next steps.' },
    ]
  
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="text-xl font-semibold text-gray-900">How we work (fast)</h2>
        <ol className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-semibold">
                {s.n}
              </div>
              <h3 className="font-semibold text-gray-900">{s.t}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    )
  }
  