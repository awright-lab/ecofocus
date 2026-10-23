import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { getReportByPriceId } from "@/lib/reports-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 }); }
  if (!body || !Array.isArray(body.items) || !body.items.length || body.items.length > 20 || body.items.some((item: { price?: unknown; quantity?: unknown }) =>
    !item || typeof item.price !== "string" || !/^price_[a-zA-Z0-9]+$/.test(item.price) || !Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > 100
  )) return NextResponse.json({ error: "Choose a report and a valid quantity before checking out." }, { status: 400 });

  try {
    const reports = await Promise.all(body.items.map((item: { price: string }) => getReportByPriceId(item.price)));
    if (reports.some((report) => !report)) return NextResponse.json({ error: "A report is no longer available at this price. Refresh the catalog and try again." }, { status: 400 });
    const stripe = getStripeServer();
    const origin = new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: body.items.map((item: { price: string; quantity: number }) => ({ price: item.price, quantity: item.quantity })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reports`,
      metadata: { source: "report-store", report_ids: JSON.stringify([...new Set(reports.map((report) => report!.id))]) },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Report checkout failed", error);
    return NextResponse.json({ error: "Checkout is temporarily unavailable. Please try again or contact us." }, { status: 503 });
  }
}
