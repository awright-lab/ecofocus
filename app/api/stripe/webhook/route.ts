// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { syncPortalInvoiceStatusFromStripeInvoice, syncPortalSubscriptionStatusFromStripeSubscription } from "@/lib/portal/billing";
import { getPortalProvisioningMetadata, upsertPortalAccountRecords, upsertPortalDashboardConfig } from "@/lib/portal/provisioning";
import { getStripeServer } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleCheckoutCompleted(s: Stripe.Checkout.Session) {
  const provisioning = getPortalProvisioningMetadata(s);
  if (!provisioning) {
    return;
  }

  await upsertPortalAccountRecords(provisioning.account);
  await upsertPortalDashboardConfig(provisioning);
}

async function handleInvoiceEvent(invoice: Stripe.Invoice, eventType: string) {
  await syncPortalInvoiceStatusFromStripeInvoice(invoice, eventType);
}

async function handleSubscriptionEvent(subscription: Stripe.Subscription) {
  await syncPortalSubscriptionStatusFromStripeSubscription(subscription);
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
        break;
      case "invoice.finalized":
      case "invoice.sent":
      case "invoice.paid":
      case "invoice.payment_failed":
        await handleInvoiceEvent(event.data.object as Stripe.Invoice, event.type);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription);
        break;
      default:
        if (process.env.NODE_ENV !== "production") {
          console.debug(`Unhandled Stripe event type: ${event.type}`);
        }
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json(
      { error: "Webhook handler failed", eventId: event.id, eventType: event.type },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
