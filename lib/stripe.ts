// lib/stripe.ts
import Stripe from "stripe";

// --- Server SDK (Node) ---
const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) throw new Error("Missing STRIPE_SECRET_KEY");

export const stripe = new Stripe(secret, {
  // Let the SDK use its pinned apiVersion to avoid TS literal mismatches
  appInfo: { name: "EcoFocus Website", version: "1.0.0" },
});

// --- Optional: Stripe.js loader for CLIENT code only ---
// Use this in client components/pages when you need Stripe.js.
// import { getStripeJs } from "@/lib/stripe"; await getStripeJs();
import { loadStripe, type Stripe as StripeJs } from "@stripe/stripe-js";

let stripeJsPromise: Promise<StripeJs | null> | null = null;

export function getStripeJs() {
  if (!stripeJsPromise) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      }
      // Still initialize to avoid runtime checks everywhere
      stripeJsPromise = Promise.resolve(null);
    } else {
      stripeJsPromise = loadStripe(pk);
    }
  }
  return stripeJsPromise;
}




