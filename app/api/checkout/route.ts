// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json();
  const { items, successUrl, cancelUrl } = body as {
    items: { price: string; quantity: number }[];
    successUrl: string;
    cancelUrl: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items,
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: "auto",
    automatic_tax: { enabled: false },
  });

  return NextResponse.json({ url: session.url });
}


