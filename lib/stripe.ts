// lib/stripe.ts
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

// Omit apiVersion to use the SDK's pinned, type-safe default
export const stripe = new Stripe(key, {
  // optional: identify your app in Stripe logs
  appInfo: { name: "EcoFocus Website", version: "1.0.0" },
});



