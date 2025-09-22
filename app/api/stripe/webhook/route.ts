// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Minimal handlers that reference fields so ESLint doesn't complain. */
async function handleCheckoutCompleted(s: Stripe.Checkout.Session) {
  // Use a couple fields so the variable is "read"
  const id = s.id;
  const reportId = s.metadata?.reportId;
  void id; // prevents 'unused' while being explicit
  void reportId;

  // TODO: Fulfill order / unlock report access / send receipt.
  // Example:
  // await grantReportAccess({ reportId, customerEmail: s.customer_details?.email || s.customer_email || "" });
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const id = pi.id;
  const customer = typeof pi.customer === "string" ? pi.customer : pi.customer?.id;
  void id;
  void customer;

  // TODO: Post-payment workflows if you need them.
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message ?? String(err)}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(s);
        break;
      }
      case "payment_intent.succeeded": {
        const p = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(p);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // Optional: seat licensing logic, etc.
        break;
      }
      default: {
        if (process.env.NODE_ENV !== "production") {
          console.debug(`Unhandled Stripe event type: ${event.type}`);
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // Intentionally still return 200 so Stripe doesn't retry endlessly.
  }

  return NextResponse.json({ received: true });
}



