import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPaidReportOrder, getPurchasedReport } from "@/lib/report-orders";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your report order | EcoFocus Research", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  let downloads: { id: string; title: string }[] = [];
  let error = "";
  try {
    const ids = await getPaidReportOrder(sessionId || "");
    downloads = await Promise.all(ids.map(async id => ({ id, title: (await getPurchasedReport(id)).title })));
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "We couldn’t verify your order. Please contact us with your receipt.";
  }
  return <><Header /><main className="bg-slate-50 px-6 py-20"><div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-12">
    <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">EcoFocus Research</p>
    <h1 className="mt-4 text-3xl font-bold text-emerald-900">{error ? "Your report order" : "Your reports are ready"}</h1>
    {error ? <p className="mt-4 text-slate-700" role="status">{error}</p> : <><p className="mt-4 text-slate-600">Thank you for your purchase. Save this private order link to return to your downloads.</p>
      <ul className="mt-8 space-y-4">{downloads.map(report => <li key={report.id}><a className="inline-flex rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800" href={`/api/reports/download?session_id=${encodeURIComponent(sessionId!)}&report_id=${encodeURIComponent(report.id)}`}>Download {report.title}</a></li>)}</ul></>}
    <Link className="mt-8 inline-block text-sm font-semibold text-emerald-900 underline" href={error ? "/contact" : "/reports"}>{error ? "Contact us" : "Explore more reports"}</Link>
  </div></main><Footer /></>;
}
