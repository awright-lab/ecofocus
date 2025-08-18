// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PRICE_ID_BY_PRODUCT } from '@/lib/stripe-prices';

export async function POST(req: Request) {
  try {
    const { items, metadata } = await req.json() as {
      items: Array<{ id: string; qty?: number }>;
      metadata?: Record<string, string>;
    };

    if (!items?.length) {
      return NextResponse.json({ error: 'No items' }, { status: 400 });
    }

    const line_items = items.map(({ id, qty }) => {
      const price = PRICE_ID_BY_PRODUCT[id];
      if (!price) throw new Error(`Missing Stripe price for ${id}`);
      return { price, quantity: Math.max(1, qty ?? 1) };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      // optional: capture who/what this was for
      metadata,
      // optional: turn on invoice/receipt emails, tax, etc.
      // automatic_tax: { enabled: true },
      // billing_address_collection: 'auto',
      // customer_creation: 'always',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
