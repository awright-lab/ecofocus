// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export const runtime = 'nodejs'; // webhooks need Node (raw body)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Example: use the fields (prevents “unused” warning)
    const sessionId = session.id;
    const customerEmail =
      session.customer_details?.email ?? session.customer_email ?? null;

    // Fetch purchased items (useful for provisioning)
    const items = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
    });

    // TODO: fulfill based on items + customerEmail
    // e.g., provision dashboard seats, send license email, etc.
    console.log('checkout.session.completed', { sessionId, customerEmail, itemsCount: items.data.length });
  }

  return NextResponse.json({ received: true });
}
