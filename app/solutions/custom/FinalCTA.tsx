// components/solutions/custom/FinalCTA.tsx
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm md:flex md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ready to design your study?</h3>
          <p className="mt-1 text-sm text-gray-600">
            Share your objectives and timelines—our team will recommend an approach and scope in plain English.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link
            href="/contact?type=custom"
            className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Request a Proposal
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Explore Reports
          </Link>
        </div>
      </div>
    </section>
  )
}
