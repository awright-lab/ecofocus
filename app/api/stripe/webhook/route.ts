import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();

  const sig = req.headers.get("stripe-signature")!;
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;
    const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });
    // TODO: fulfill (grant report access, send email, etc.)
    console.log("fulfilled", { sessionId, items: items.data.length });
  }

  return NextResponse.json({ received: true });
}

