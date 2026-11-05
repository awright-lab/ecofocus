import Image from "next/image";
import Hero from "@/components/Hero";
import type { ReportDetail } from "@/lib/reports-repo";
import PurchaseButtons from "./PurchaseButtons";
import FreeGateButton from "./FreeGateButton";

export default function CoverHero({ report, preview = false }: { report: ReportDetail; preview?: boolean }) {
  const paid = report.access === "Premium";
  const price = typeof report.price === "number" ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(report.price) : report.priceDisplay;
  return <Hero variant="report" size="compact" headline={report.title}
    videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4" overlay="dense">
    <div className="overflow-hidden rounded-3xl border border-white/20 bg-white text-slate-900 shadow-xl">
      <div className="grid md:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="flex items-center justify-center border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-slate-50 px-5 py-5 md:border-b-0 md:border-r">
          {report.cover ? <a href={report.cover} target="_blank" rel="noopener noreferrer" aria-label="View full-size report cover" className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"><Image src={report.cover} alt={`${report.title} cover`} width={500} height={650} sizes="(min-width: 1024px) 360px, (min-width: 768px) 280px, 260px" className="h-auto max-h-[510px] w-[260px] rounded-lg border border-slate-200 object-contain shadow-lg md:w-full md:max-w-[360px]" priority /></a> : <div className="flex aspect-[3/4] w-40 flex-col justify-between rounded-lg bg-emerald-900 p-6 text-white shadow-lg"><span className="text-sm font-semibold">EcoFocus Research</span><span className="text-2xl font-bold">{report.year}<br />Report</span></div>}
        </div>
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">{paid ? "Research report" : "Free report"}</span>
            <span className="text-slate-500">{[report.year, report.format, report.pages ? `${report.pages} pages` : undefined].filter(Boolean).join(" · ")}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem]">{report.title}</h1>
          {report.subtitle && <p className="mt-3 text-lg font-medium leading-relaxed text-emerald-800">{report.subtitle}</p>}
          {report.description && <div className="mt-4"><h2 className="text-sm font-semibold text-slate-900">About this report</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">{report.description}</p></div>}
          <a href="#report-overview" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 underline underline-offset-4">Contents, methodology, and what’s included <span aria-hidden="true">↓</span></a>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{paid ? "Report price · USD" : "Digital report"}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{paid ? price || "Contact us for pricing" : "Free download"}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
            {preview ? <button type="button" disabled className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-500">Checkout unavailable in preview</button> : paid ? report.priceId ? <PurchaseButtons priceId={report.priceId} title={report.title} /> : <a href="/contact" className="mt-4 inline-block font-semibold text-emerald-800 underline">Contact us for availability</a> : <div className="mt-4"><FreeGateButton fileHref={report.freeHref} /></div>}
            {paid && <a href={`/contact?inquiry=report-invoice&report=${encodeURIComponent(report.title)}#EcoFocus_Contact_Form`} className="inline-flex rounded-full border border-emerald-700 px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">Contact us to be billed</a>}
            </div>
            {paid ? <p className="mt-3 text-xs leading-relaxed text-slate-600"><span aria-hidden="true">🔒 </span>Secure checkout with Stripe. Card details are entered directly on Stripe’s hosted checkout.</p> : <p className="mt-3 text-xs text-slate-500">Download the report directly to your device.</p>}
            {preview && <p className="mt-2 text-xs text-slate-500">Preview only. The report is not yet available to purchase.</p>}
            {report.sampleHref && <a href={report.sampleHref} className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4">View a sample</a>}
          </div>
        </div>
      </div>
    </div>
  </Hero>;
}
