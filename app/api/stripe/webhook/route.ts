// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Minimal handlers that reference fields so ESLint doesn't complain. */
async function handleCheckoutCompleted(s: Stripe.Checkout.Session) {
  const id = s.id;
  const reportId = s.metadata?.reportId;
  void id; void reportId;
  // TODO: fulfill order / unlock report access / send receipt
}

async function handlePaymentSucceeded(p: Stripe.PaymentIntent) {
  const id = p.id;
  const customer = typeof p.customer === "string" ? p.customer : p.customer?.id;
  void id; void customer;
  // TODO: post-payment workflows
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  if (!webhookSecret) return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeServer(); // <-- created lazily at request time
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
  } catch (err: any) {
    // Covers both missing STRIPE_SECRET_KEY and bad signature
    const msg = err?.message ?? String(err);
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        break;
      default:
        if (process.env.NODE_ENV !== "production") {
          console.debug(`Unhandled Stripe event type: ${event.type}`);
        }
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    // Still return 200 so Stripe doesn't retry forever unless you want retries.
  }

  return NextResponse.json({ received: true });
}




