// lib/checkout.ts
export async function startCheckout(
    items: Array<{ id: string; qty?: number }>,
    metadata?: Record<string, string>
  ) {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items, metadata }),
    });
    if (!res.ok) throw new Error('Checkout failed');
    const { url } = await res.json();
    window.location.href = url; // redirect to Stripe Checkout
  }
  