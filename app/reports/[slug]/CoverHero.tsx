import Image from "next/image";
import Hero from "@/components/Hero";
import type { ReportDetail } from "@/lib/reports-repo";
import PurchaseButtons from "./PurchaseButtons";
import FreeGateButton from "./FreeGateButton";

export default function CoverHero({ report }: { report: ReportDetail }) {
  const paid = report.access === "Premium";
  const price = typeof report.price === "number" ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(report.price) : report.priceDisplay;
  return <Hero variant="report" size="short" headline={report.title}
    videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4" overlay="dense">
    <div className="overflow-hidden rounded-3xl border border-white/20 bg-white text-slate-900 shadow-xl">
      <div className="grid md:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex items-center justify-center border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-slate-50 px-8 py-8 md:border-b-0 md:border-r sm:py-10">
          {report.cover ? <Image src={report.cover} alt={`${report.title} cover`} width={500} height={650} sizes="(min-width: 768px) 240px, 180px" className="h-auto max-h-[340px] w-[180px] rounded-lg border border-slate-200 object-contain shadow-lg md:w-[240px]" priority /> : <div className="flex aspect-[3/4] w-40 flex-col justify-between rounded-lg bg-emerald-900 p-6 text-white shadow-lg"><span className="text-sm font-semibold">EcoFocus Research</span><span className="text-2xl font-bold">{report.year}<br />Report</span></div>}
        </div>
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">{paid ? "Research report" : "Free report"}</span>
            <span className="text-slate-500">{[report.year, report.format].filter(Boolean).join(" · ")}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">{report.title}</h1>
          {report.subtitle && <p className="mt-3 text-lg font-medium leading-relaxed text-emerald-800">{report.subtitle}</p>}
          {report.description && <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{report.description}</p>}
          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{paid ? "Report price · USD" : "Digital report"}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{paid ? price || "Contact us for pricing" : "Free download"}</p>
            {paid ? report.priceId ? <PurchaseButtons priceId={report.priceId} title={report.title} /> : <a href="/contact" className="mt-4 inline-block font-semibold text-emerald-800 underline">Contact us for availability</a> : <div className="mt-4"><FreeGateButton fileHref={report.freeHref} /></div>}
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{paid ? "Secure payment through Stripe. Download your file after payment is confirmed." : "Download the report directly to your device."}</p>
            {report.sampleHref && <a href={report.sampleHref} className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4">View a sample</a>}
          </div>
        </div>
      </div>
    </div>
  </Hero>;
}
