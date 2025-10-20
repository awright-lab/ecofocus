// components/benchmark/Callouts.tsx
import Link from "next/link";

export function GetResultsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(2,12,27,.18)]">
      <h3 className="text-lg font-semibold text-slate-900">
        Get Your Brand’s Results Today
      </h3>
      <p className="mt-2 text-slate-600">
        Learn how eco-friendly your brand is perceived by consumers and your
        customers. Do a deeper dive by comparing your brand to other brands in your
        category and/or by filtering and cross-tabbing by key demographic variables
        and behavioral or attitudinal data.
      </p>

      <div className="mt-4 space-y-1 text-sm">
        <p className="text-slate-700">
          Questions or custom filters:{" "}
          <span className="font-medium">Michael Croft, VP Biz Dev</span>
        </p>
        <p>
          <a
            href="mailto:mcroft@ecofocusworldwide.com"
            className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-600"
          >
            mcroft@ecofocusworldwide.com
          </a>
        </p>
        <p className="pt-2 text-xs text-slate-500">
          Usage Rights: Internal and External usage with attribution to EcoFocus® 2025.
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
        >
          Request Access
        </Link>
      </div>
    </div>
  );
}

export function MethodsSnapshotCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(2,12,27,.18)]">
      <h3 className="text-lg font-semibold text-slate-900">Methods Snapshot</h3>
      <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-700">Measures</dt>
          <dd className="mt-1 text-slate-600">
            Brand awareness; Purchase incidence &amp; frequency; Perceived eco-friendliness
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Verticals &amp; brands</dt>
          <dd className="mt-1 text-slate-600">CPG, Soft Goods, Homeowners, Pets</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Deliverables</dt>
          <dd className="mt-1 text-slate-600">
            See package options (format, usage rights, optional filters)
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Fielding window</dt>
          <dd className="mt-1 text-slate-600">September 2025</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Sample/specs</dt>
          <dd className="mt-1 text-slate-600">N=4,000, balanced to US Census</dd>
        </div>
      </dl>
    </div>
  );
}
