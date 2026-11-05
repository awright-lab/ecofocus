import Breadcrumbs from "@/components/Breadcrumbs";
import type { ReportDetail } from "@/lib/reports-repo";
import CoverHero from "./CoverHero";
import ReportBody from "./ReportBody";

export default function ReportContent({ report, preview = false }: { report: ReportDetail; preview?: boolean }) {
  return (
      <main className="bg-white pt-14 text-gray-900 md:pt-20">
        {preview && <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-center text-sm font-medium text-amber-900" role="status">Report preview · Purchases are unavailable until the PDF is attached.</div>}
        <CoverHero report={report} preview={preview} />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Reports", href: "/reports" },
            { label: report.title },
          ]}
          maxWidth="max-w-7xl"
        />

        <section className="mx-auto grid max-w-7xl gap-10 scroll-mt-24 px-6 py-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16" id="report-overview" aria-labelledby="report-overview-heading">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">A closer look</p>
            <h2 id="report-overview-heading" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Inside the report</h2>
            <ReportBody body={report.body || report.description || "Contact our team for more information about this report."} />
          </div>
          <aside className="self-start rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8" aria-labelledby="report-details">
            <h2 id="report-details" className="text-lg font-semibold text-slate-900">Report details</h2>
            <dl className="mt-5 divide-y divide-emerald-100 text-sm">
              {[["Year", report.year], ["Topic", report.topic], ["Study wave", report.wave], ["Format", report.format], ["Length", report.pages ? `${report.pages} pages` : undefined]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="flex justify-between gap-5 py-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium text-slate-800">{value}</dd></div>)}
            </dl>
            <div className="mt-6 border-t border-emerald-100 pt-6">
              <h3 className="font-semibold text-slate-900">Need help choosing?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Talk with our team about this report, licensing, or research for your organization.</p>
              <a href="/contact" className="mt-4 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4">Talk to EcoFocus</a>
            </div>
          </aside>
        </section>
      </main>
  );
}
