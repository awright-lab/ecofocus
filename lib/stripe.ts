// lib/stripe.ts
import Stripe from "stripe";

// ----- SERVER (Node) -----
let stripeServerSingleton: Stripe | null = null;

/** Get a singleton Stripe server SDK instance lazily at runtime. */
export function getStripeServer(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Throw ONLY when actually used at runtime, not during module import.
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripeServerSingleton) {
    stripeServerSingleton = new Stripe(key, {
      // Let the SDK use its pinned apiVersion (avoids TS literal mismatches)
      appInfo: { name: "EcoFocus Website", version: "1.0.0" },
    });
  }
  return stripeServerSingleton;
}

// ----- CLIENT (Browser) -----
// Optional helper to load Stripe.js where needed in client components/pages.
import { loadStripe, type Stripe as StripeJs } from "@stripe/stripe-js";

let stripeJsPromise: Promise<StripeJs | null> | null = null;
export function getStripeJs() {
  if (!stripeJsPromise) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
      }
      stripeJsPromise = Promise.resolve(null);
    } else {
      stripeJsPromise = loadStripe(pk);
    }
  }
  return stripeJsPromise;
}




