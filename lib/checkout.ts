export async function checkoutPrices(items: Array<{ price: string; quantity: number }>) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const data = await response.json();
  if (!response.ok || typeof data.url !== 'string') throw new Error(data.error || 'Checkout is unavailable. Please try again.');
  window.location.assign(data.url);
}

// Older catalog components still submit product IDs. Keep their failure explicit
// until they are replaced by the CMS catalog rather than guessing a Stripe price.
export async function startCheckout(_items: Array<{ id: string; qty?: number }>, _metadata?: Record<string, string>) {
  void _items;
  void _metadata;
  throw new Error('Please open this report from the Reports catalog to purchase it.');
}
