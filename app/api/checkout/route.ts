// app/api/checkout/route.ts
// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { items, successUrl, cancelUrl, metadata, customerEmail, clientReferenceId } = await req.json();

  try {
    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items, // [{ price, quantity }]
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata && typeof metadata === "object" ? metadata : undefined,
      customer_email: typeof customerEmail === "string" ? customerEmail : undefined,
      client_reference_id: typeof clientReferenceId === "string" ? clientReferenceId : undefined,
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    const msg = e?.message ?? "Checkout error";
    console.error("Checkout error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


