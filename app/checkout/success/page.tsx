import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getReportSiteOrigin } from "@/lib/report-site";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getReportOrderStatus, getReportOrderDetails, getPurchasedReport } from "@/lib/report-orders";
import OrderActions from "./OrderActions";
import PendingOrder from "./PendingOrder";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your report order | EcoFocus Research", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Download = Awaited<ReturnType<typeof getPurchasedReport>> & { id: string };

export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "").split(",")[0].split(":")[0].toLowerCase();
  if (process.env.NODE_ENV === "production" && host.endsWith(".netlify.app")) {
    const target = new URL("/checkout/success", getReportSiteOrigin());
    if (sessionId) target.searchParams.set("session_id", sessionId);
    redirect(target.toString());
  }
  let status: Awaited<ReturnType<typeof getReportOrderStatus>> | null = null;
  let order: Awaited<ReturnType<typeof getReportOrderDetails>> | null = null;
  let downloads: Download[] = [];
  let error = "";
  try {
    status = await getReportOrderStatus(sessionId || "");
    if (status.state === "paid") {
      order = await getReportOrderDetails(sessionId || "");
      downloads = await Promise.all(order.ids.map(async id => ({ id, ...await getPurchasedReport(id) })));
    }
  } catch (cause) {
    console.error("Report order page failed", cause instanceof Error ? cause.message : "Unknown error");
    error = status?.state === "paid" ? "Your payment is confirmed, but we couldn’t prepare your downloads. Please contact us with your order reference below." : "We couldn’t verify this order. Please use the private order link from your purchase, or contact us for help.";
  }
  const singular = downloads.length === 1;
  const summary = order || status;
  const pending = status?.state === "pending";
  const paid = status?.state === "paid";
  const amount = summary ? new Intl.NumberFormat("en-US", { style: "currency", currency: summary.currency }).format(summary.amountTotal / 100) : "";
  const heading = error ? "Your report order" : pending ? "Your payment is processing" : status?.state === "expired" ? "Your checkout link has expired" : status?.state === "failed" ? "Your payment wasn’t completed" : status?.state === "incomplete" ? "Your checkout isn’t complete" : singular ? "Your report is ready" : "Your reports are ready";
  const intro = error || (pending ? "We’ve received your order. Stripe is still confirming the payment. We’ll unlock your downloads and email your private link once payment is confirmed. You don’t need to pay again." : status?.state === "expired" ? "This checkout expired before payment was completed. Return to reports when you’re ready to start a new checkout." : status?.state === "failed" ? "Stripe could not complete this payment. You can try a different payment method, or contact us for help." : status?.state === "incomplete" ? "Stripe hasn’t confirmed a completed checkout. Return to your checkout to finish payment." : "Thank you for your purchase. Download your report below and keep your private order link for future access.");
  return <><Header /><main className="bg-slate-50 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 md:pt-32">
    <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="order-heading">
      <div className="p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">EcoFocus Research</p>
        {paid && <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800"><svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>Payment confirmed</div>}
        <h1 id="order-heading" className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{heading}</h1>
        <p className="mt-4 leading-relaxed text-slate-600" role={error ? "status" : undefined}>{intro}</p>
        {summary && <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-5 text-sm"><div><dt className="text-slate-500">Order reference</dt><dd className="mt-1 font-semibold text-slate-900">{summary.reference}</dd></div><div className="text-right"><dt className="text-slate-500">{paid ? "Amount paid" : "Order total"}</dt><dd className="mt-1 font-semibold text-slate-900">{amount} <span className="font-normal uppercase text-slate-500">{summary.currency}</span></dd></div></dl>}
        {!error && paid && <ul className="mt-7 space-y-4" aria-label="Purchased reports">{downloads.map(report => <li key={report.id} className="flex flex-col gap-5 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            {report.cover ? <Image src={report.cover} alt={`${report.title} cover`} width={72} height={96} className="h-24 w-[72px] shrink-0 rounded-md border border-slate-200 object-contain bg-slate-50" /> : <div className="flex h-24 w-[72px] shrink-0 items-center justify-center rounded-md bg-emerald-50 text-xs font-semibold text-emerald-800">{report.format}</div>}
            <div className="min-w-0"><h2 className="font-semibold leading-snug text-slate-900">{report.title}</h2><p className="mt-2 text-sm text-slate-500">{report.format}{report.filesize ? ` · ${(report.filesize / 1024 / 1024).toFixed(1)} MB` : ""}</p></div>
          </div>
          <a className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 sm:self-center" aria-label={`Download ${report.title}`} href={`/api/reports/download?session_id=${encodeURIComponent(sessionId!)}&report_id=${encodeURIComponent(report.id)}`}><svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3v9m-4-4 4 4 4-4M4 13v4h12v-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>Download {report.format}</a>
        </li>)}</ul>}
        {error && sessionId && <a href={`/checkout/success?session_id=${encodeURIComponent(sessionId)}`} className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">Check order again</a>}
        {pending && !error && <PendingOrder sessionId={sessionId!} />}
        {status?.state === "incomplete" && status.checkoutUrl && <a href={status.checkoutUrl} className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">Return to checkout</a>}
        {order && <OrderActions sessionId={sessionId!} reference={order.reference} purchased={order.items.map(item => ({ priceId: item.priceId, qty: item.qty }))} emailSent={order.emailSent} />}
        <div className="mt-7 flex flex-wrap justify-between gap-4 text-sm"><Link className="font-semibold text-emerald-800 underline underline-offset-4" href="/reports">Explore more reports</Link><Link className="text-slate-600 underline underline-offset-4" href="/contact">Need help with your order?</Link></div>
      </div>
    </section>
  </main><Footer /></>;
}
