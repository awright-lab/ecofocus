import "server-only";
import { getStripeServer } from "@/lib/stripe";

export async function getPaidReportOrder(sessionId: string) {
  if (!/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(sessionId)) throw new Error("Invalid order link.");
  const session = await getStripeServer().checkout.sessions.retrieve(sessionId);
  if (session.status !== "complete" || session.payment_status !== "paid" || session.metadata?.source !== "report-store") {
    throw new Error("Payment has not been confirmed for this order.");
  }
  const ids: unknown = JSON.parse(session.metadata.report_ids || "[]");
  if (!Array.isArray(ids) || !ids.length || ids.some(id => typeof id !== "string")) throw new Error("This order has no reports.");
  return ids as string[];
}

export async function getPurchasedReport(id: string) {
  const base = (process.env.PAYLOAD_BASE_URL || process.env.NEXT_PUBLIC_CMS_URL || "").replace(/\/$/, "");
  if (!base || !process.env.REPORTS_API_KEY) throw new Error("Report delivery is unavailable. Please contact us with your receipt.");
  const headers = { Authorization: `users API-Key ${process.env.REPORTS_API_KEY}` };
  const response = await fetch(`${base}/api/reports/${encodeURIComponent(id)}?depth=1`, { headers, cache: "no-store" });
  if (!response.ok) throw new Error("The purchased report could not be loaded.");
  const report = await response.json();
  const file = report.downloadFile;
  if (!file?.filename) throw new Error("The purchased file is unavailable. Please contact us with your receipt.");
  return { title: String(report.title), filename: String(file.filename), url: `${base}/api/report-files/file/${encodeURIComponent(file.filename)}`, headers };
}
