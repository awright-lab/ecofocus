// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any, // safe cast to avoid TS error
  appInfo: {
    name: "EcoFocus Storefront",
    version: "0.1.0",
  },
});

