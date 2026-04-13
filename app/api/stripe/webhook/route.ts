// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { syncPortalInvoiceStatusFromStripeInvoice, syncPortalSubscriptionStatusFromStripeSubscription } from "@/lib/portal/billing";
import { getPortalCompanies } from "@/lib/portal/data";
import { sendPortalInvoicePaidNotificationEmail } from "@/lib/portal/email";
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

  if (eventType !== "invoice.paid") {
    return;
  }

  const portalCompanyId = String(invoice.metadata?.portalCompanyId || "").trim();
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id || null;
  const companies = await getPortalCompanies();
  const company =
    (portalCompanyId ? companies.find((item) => item.id === portalCompanyId) : null) ||
    (customerId ? companies.find((item) => item.stripeCustomerId === customerId) : null) ||
    null;

  if (!company) {
    console.warn("[portal/billing] Invoice paid email skipped because the company could not be resolved.", {
      invoiceId: invoice.id,
      portalCompanyId,
      customerId,
    });
    return;
  }

  await sendPortalInvoicePaidNotificationEmail({
    companyName: company.name,
    amountPaidUsd: (invoice.amount_paid || 0) / 100,
    invoiceId: invoice.id,
    hostedInvoiceUrl: invoice.hosted_invoice_url || null,
    paidAt: invoice.status_transitions?.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
      : null,
  });
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
