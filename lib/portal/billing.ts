import type Stripe from "stripe";
import { getPortalCompanies } from "@/lib/portal/data";
import type { PortalInvoiceSummary, PortalSubscription } from "@/lib/portal/types";
import { getStripeServer } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase/server";

function hasStripeSecretKey() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

type PortalBillingStatus = NonNullable<PortalSubscription["billingStatus"]>;

function getInvoiceCustomerId(invoice: Stripe.Invoice) {
  return typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id || null;
}

function mapInvoiceToPortalBillingStatus(
  invoice: Pick<Stripe.Invoice, "status" | "collection_method" | "due_date">,
  eventType?: string,
): PortalBillingStatus {
  if (eventType === "invoice.paid") {
    return "paid";
  }

  if (eventType === "invoice.payment_failed") {
    return "payment_failed";
  }

  if (invoice.status === "draft") {
    return "invoice_draft";
  }

  if (invoice.status === "paid") {
    return "paid";
  }

  if (invoice.status === "uncollectible" || invoice.status === "void") {
    return "payment_failed";
  }

  if (invoice.status === "open") {
    if (eventType === "invoice.finalized" || eventType === "invoice.sent") {
      return "invoice_sent";
    }

    if (invoice.collection_method === "send_invoice") {
      return invoice.due_date ? "invoice_sent" : "payment_pending";
    }

    return "payment_pending";
  }

  return "not_invoiced";
}

async function resolvePortalSubscriptionIdFromInvoice(invoice: Stripe.Invoice) {
  const metadataSubscriptionId = String(invoice.metadata?.portalSubscriptionId || "").trim();
  if (metadataSubscriptionId) {
    return metadataSubscriptionId;
  }

  const customerId = getInvoiceCustomerId(invoice);
  if (!customerId) {
    return null;
  }

  const admin = getServiceSupabase();
  const { data, error } = await admin
    .from("portal_companies")
    .select("subscription_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.subscription_id ? String(data.subscription_id) : null;
}

export async function syncPortalInvoiceStatusFromStripeInvoice(invoice: Stripe.Invoice, eventType?: string) {
  const subscriptionId = await resolvePortalSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) {
    return null;
  }

  const billingStatus = mapInvoiceToPortalBillingStatus(invoice, eventType);
  const paidAt =
    billingStatus === "paid" && invoice.status_transitions.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
      : null;
  const dueAt = invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null;
  const customerId = getInvoiceCustomerId(invoice);

  const admin = getServiceSupabase();
  const { error } = await admin
    .from("portal_subscriptions")
    .update({
      billing_status: billingStatus,
      latest_invoice_id: invoice.id,
      latest_invoice_status: invoice.status,
      latest_invoice_amount_due: invoice.amount_due,
      latest_invoice_amount_paid: invoice.amount_paid,
      latest_invoice_currency: invoice.currency,
      latest_invoice_due_at: dueAt,
      latest_invoice_paid_at: paidAt,
    })
    .eq("id", subscriptionId);

  if (error) {
    throw new Error(error.message);
  }

  const portalCompanyId = String(invoice.metadata?.portalCompanyId || "").trim();
  if (customerId && portalCompanyId) {
    const { error: companyError } = await admin
      .from("portal_companies")
      .update({
        stripe_customer_id: customerId,
      })
      .eq("id", portalCompanyId);

    if (companyError) {
      throw new Error(companyError.message);
    }
  }

  return {
    subscriptionId,
    billingStatus,
  };
}

export async function ensurePortalStripeCustomer(companyId: string) {
  const company = (await getPortalCompanies()).find((item) => item.id === companyId) || null;
  if (!company) {
    throw new Error("Company not found.");
  }

  if (company.stripeCustomerId) {
    return {
      company,
      stripeCustomerId: company.stripeCustomerId,
    };
  }

  if (!hasStripeSecretKey()) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  const stripe = getStripeServer();
  const customer = await stripe.customers.create({
    name: company.name,
    email: company.billingEmail || undefined,
    metadata: {
      portalCompanyId: company.id,
      portalSubscriptionId: company.subscriptionId,
    },
  });

  const admin = getServiceSupabase();
  const { error } = await admin
    .from("portal_companies")
    .update({
      stripe_customer_id: customer.id,
    })
    .eq("id", company.id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    company: {
      ...company,
      stripeCustomerId: customer.id,
    },
    stripeCustomerId: customer.id,
  };
}

export async function listPortalInvoicesByCompany(companyId: string, limit = 12): Promise<PortalInvoiceSummary[]> {
  const company = (await getPortalCompanies()).find((item) => item.id === companyId) || null;
  if (!company?.stripeCustomerId || !hasStripeSecretKey()) {
    return [];
  }

  const stripe = getStripeServer();
  const invoices = await stripe.invoices.list({
    customer: company.stripeCustomerId,
    limit,
  });

  return invoices.data.map((invoice) => ({
    id: String(invoice.id),
    number: invoice.number || null,
    status: invoice.status || "draft",
    currency: invoice.currency,
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    hostedInvoiceUrl: invoice.hosted_invoice_url || null,
    invoicePdf: invoice.invoice_pdf || null,
    description:
      invoice.lines.data[0]?.description ||
      (typeof invoice.description === "string" ? invoice.description : null),
    createdAt: new Date(invoice.created * 1000).toISOString(),
    dueAt: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
  }));
}

export async function createPortalInvoiceForCompany(input: {
  companyId: string;
  amountUsd: number;
  description: string;
  memo?: string | null;
  daysUntilDue?: number;
}) {
  if (!hasStripeSecretKey()) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  const amountUsd = Number(input.amountUsd);
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    throw new Error("Invoice amount must be greater than zero.");
  }

  const description = String(input.description || "").trim();
  if (!description) {
    throw new Error("Invoice description is required.");
  }

  const { company, stripeCustomerId } = await ensurePortalStripeCustomer(input.companyId);
  if (!company.billingEmail) {
    throw new Error("A billing email is required before an invoice can be sent.");
  }

  const stripe = getStripeServer();

  await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    amount: Math.round(amountUsd * 100),
    currency: "usd",
    description,
    metadata: {
      portalCompanyId: company.id,
      portalSubscriptionId: company.subscriptionId,
    },
  });

  const invoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    collection_method: "send_invoice",
    pending_invoice_items_behavior: "include",
    days_until_due: Math.max(1, Math.min(90, Math.round(input.daysUntilDue || 30))),
    auto_advance: false,
    description,
    footer: input.memo ? String(input.memo) : undefined,
    metadata: {
      portalCompanyId: company.id,
      portalSubscriptionId: company.subscriptionId,
    },
  });

  if (!invoice.id) {
    throw new Error("Stripe did not return an invoice id.");
  }

  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
  if (!finalizedInvoice.id) {
    throw new Error("Stripe did not return a finalized invoice id.");
  }
  const sentInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id);
  await syncPortalInvoiceStatusFromStripeInvoice(sentInvoice, "invoice.sent");

  return {
    id: sentInvoice.id,
    hostedInvoiceUrl: sentInvoice.hosted_invoice_url || null,
    invoicePdf: sentInvoice.invoice_pdf || null,
    status: sentInvoice.status || "open",
  };
}

export async function createPortalBillingPortalSession(companyId: string, returnUrl: string) {
  if (!hasStripeSecretKey()) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  const { stripeCustomerId } = await ensurePortalStripeCustomer(companyId);
  const stripe = getStripeServer();

  return stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
}
