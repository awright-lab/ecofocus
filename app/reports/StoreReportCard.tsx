"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BarChart3, BookOpen, CalendarDays, Download, FileText } from "lucide-react";
import type { ReportListItem } from "@/lib/reports-repo";

export default function StoreReportCard({ item }: { item: ReportListItem }) {
  const [failedCover, setFailedCover] = useState<string | null>(null);
  const cover = item.cover || item.thumbnail;
  const hasCover = Boolean(cover && failedCover !== cover);
  const isFree = item.access === "Free";
  const href = `/reports/${encodeURIComponent(item.slug)}`;
  const FormatIcon = /data|excel|csv/i.test(item.format || "") ? BarChart3 : FileText;
  const price = isFree ? "Free" : item.price > 0
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(item.price)
    : "Contact us";

  return (
    <article aria-labelledby={`report-${item.id}`} className="group overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="grid md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative flex min-h-64 items-center justify-center overflow-hidden border-b border-emerald-900/10 bg-emerald-50 px-8 py-8 md:border-b-0 md:border-r md:py-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-emerald-700/10" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full border-[32px] border-teal-600/5" />
          {hasCover ? (
            <Image src={cover!} alt="" width={320} height={420} sizes="(min-width:1024px) 216px, 176px" className="relative h-auto max-h-72 w-auto max-w-[176px] rounded-md object-contain shadow-[0_16px_28px_-12px_rgba(6,78,59,0.4)] transition-transform duration-300 motion-safe:group-hover:-translate-y-1 lg:max-w-[216px]" onError={() => setFailedCover(cover!)} />
          ) : (
            <div className="relative flex aspect-[3/4] w-44 flex-col justify-between rounded-lg bg-emerald-900 p-5 text-white shadow-lg">
              <span className="text-xs font-semibold tracking-wide text-emerald-100">EcoFocus Research</span>
              <FormatIcon aria-hidden="true" className="h-14 w-14 text-teal-300" strokeWidth={1.3} />
              <span className="h-1 w-12 rounded-full bg-[#EF9601]" />
            </div>
          )}
        </Link>
        <div className="flex min-w-0 flex-col px-6 py-7 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-wider text-emerald-800"><BookOpen aria-hidden="true" size={15} />{isFree ? "Free report" : "Research report"}</span>
            {item.year > 0 && <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" size={14} />{item.year}</span>}
            {item.format && <span className="inline-flex items-center gap-1.5"><FormatIcon aria-hidden="true" size={14} />{item.format}</span>}
            {!!item.pages && <span>{item.pages} pages</span>}
          </div>
          <h3 id={`report-${item.id}`} className="mt-5 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-emerald-950 lg:text-3xl">
            <Link href={href} className="rounded-sm decoration-emerald-500 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">{item.title}</Link>
          </h3>
          {item.description && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>}
          {!!item.tags?.length && <ul aria-label="Report topics" className="mt-5 flex flex-wrap gap-2">{item.tags.slice(0, 4).map(tag => <li key={tag} className="rounded-full border border-emerald-900/10 bg-emerald-50/60 px-3 py-1 text-xs text-emerald-900">{tag}</li>)}</ul>}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-emerald-900/10 pt-6">
            <div><p className="text-xs text-slate-500">{isFree ? "Complimentary download" : item.price > 0 ? "Report price · USD" : "Pricing"}</p><p className="mt-1 text-2xl font-bold tracking-tight text-emerald-950">{price}</p></div>
            <Link href={href} aria-label={`${isFree ? "View download" : "Explore report"}: ${item.title}`} className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">{isFree ? "View download" : "Explore report"}{isFree ? <Download aria-hidden="true" size={17} /> : <ArrowUpRight aria-hidden="true" size={17} />}</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
