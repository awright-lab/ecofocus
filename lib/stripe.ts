// lib/stripe.ts
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Do NOT create at build time without a key
    throw new Error("Stripe key missing. Set STRIPE_SECRET_KEY in environment.");
  }

  _stripe = new Stripe(key, {
    apiVersion: "2024-06-20" as any,
    appInfo: {
        name: "EcoFocus Storefront",
        version: "0.1.0",
      },
  });

  return _stripe;
}

