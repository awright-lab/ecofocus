import Image from "next/image";
import type { ReportDetail } from "@/lib/reports-repo";

export default function CoverHero({ report }: { report: ReportDetail }) {
  return <section className="overflow-hidden bg-[#0B1116] text-white">
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:py-20 md:grid-cols-[1fr_240px]">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">EcoFocus Research · {report.access === "Free" ? "Free report" : "Research report"}</p>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{report.title}</h1>
        {(report.subtitle || report.description) && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{report.subtitle || report.description}</p>}
        <p className="mt-6 text-sm text-emerald-300">{[report.year, report.format, report.pages ? `${report.pages} pages` : null].filter(Boolean).join(" · ")}</p>
      </div>
      {report.cover && <div className="relative mx-auto w-48 overflow-hidden rounded-xl border border-white/20 shadow-2xl md:w-60"><Image src={report.cover} alt={`${report.title} cover`} width={480} height={640} className="h-auto w-full" priority /></div>}
    </div>
  </section>;
}
