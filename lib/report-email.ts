import "server-only";
import { getReportOrderDetails } from "@/lib/report-orders";
import { getReportSiteOrigin } from "@/lib/report-site";
import { getStripeServer } from "@/lib/stripe";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export async function sendReportOrderEmail(sessionId: string) {
  const order = await getReportOrderDetails(sessionId);
  if (!order.email) throw new Error("No checkout email address is available for this order.");
  if (order.emailSent) return { sent: true, alreadySent: true };
  const key = process.env.RESEND_API_KEY;
  const from = process.env.REPORTS_FROM_EMAIL || process.env.PORTAL_FROM_EMAIL;
  if (!key || !from) throw Object.assign(new Error("Report email requires RESEND_API_KEY and REPORTS_FROM_EMAIL (or PORTAL_FROM_EMAIL)."), { code: "email_not_configured" });
  const origin = getReportSiteOrigin();
  const link = new URL("/checkout/success", origin);
  link.searchParams.set("session_id", sessionId);
  const total = new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.amountTotal / 100);
  const titles = order.items.map(item => item.title);
  const subject = `Your EcoFocus report downloads · ${order.reference}`;
  const text = `Thank you for your purchase. Your payment is confirmed.\n\nOrder ${order.reference}\nAmount paid: ${total}\n\n${titles.join("\n")}\n\nView your downloads: ${link}\n\nKeep this link private. It provides access to the reports in your order.\nNeed help? Visit https://ecofocusresearch.com/contact and quote your order reference.`;
  const html = `<div style="background:#f1f8f5;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a"><div style="max-width:600px;margin:auto;border-radius:20px;background:#fff;border:1px solid #dbe8e2;padding:32px"><p style="color:#047857;font-size:12px;letter-spacing:2px;font-weight:bold">ECOFOCUS RESEARCH</p><h1 style="font-size:28px">Your ${titles.length === 1 ? "report is" : "reports are"} ready</h1><p>Thank you for your purchase. Your payment is confirmed.</p><p><strong>Order ${escapeHtml(order.reference)}</strong><br />Amount paid: ${escapeHtml(total)}</p><ul>${titles.map(title => `<li style="margin-bottom:8px">${escapeHtml(title)}</li>`).join("")}</ul><p style="margin:28px 0"><a href="${escapeHtml(link.toString())}" style="display:inline-block;background:#047857;color:#fff;text-decoration:none;border-radius:24px;padding:14px 24px;font-weight:bold">View your downloads</a></p><p style="color:#64748b;font-size:13px;line-height:1.6">Keep this link private. It provides access to the reports in your order.</p><p style="font-size:13px">Need help? <a href="https://ecofocusresearch.com/contact" style="color:#047857">Contact EcoFocus</a> and quote your order reference.</p></div></div>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `report-order/${sessionId}` },
    body: JSON.stringify({ from, to: [order.email], subject, text, html }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw Object.assign(new Error(`Report email was not accepted by the email provider (${response.status}).`), { code: "email_provider_rejected" });
  const result = await response.json();
  if (!result.id) throw new Error("The email provider did not confirm acceptance.");
  await getStripeServer().checkout.sessions.update(sessionId, { metadata: { report_email_sent: "true", report_email_id: String(result.id) } });
  return { sent: true, alreadySent: false };
}
