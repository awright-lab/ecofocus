// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const stripe = getStripe();

    const { items, metadata } = await req.json();
    // items: [{ id: 'sir-2024', qty: 1 }, ...]

    // Map your catalog IDs -> Stripe price IDs (or use Lookup Keys)
    const line_items = (items ?? []).map((it: any) => ({
      // Replace with your real price IDs
      price: process.env[`STRIPE_PRICE_${String(it.id).toUpperCase().replace(/[-.]/g, "_")}`],
      quantity: it.qty ?? 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    // During build, if env is missing, this returns 500 instead of crashing build
    return NextResponse.json({ error: err.message ?? "Checkout error" }, { status: 500 });
  }
}

