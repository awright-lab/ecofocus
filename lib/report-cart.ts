export type PurchasedCartItem = { priceId: string; qty: number };
type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** Consume purchased quantities once, preserving anything added after checkout. */
export function clearPurchasedCart(storage: StorageLike, orderReference: string, purchased: PurchasedCartItem[]) {
  const previous: unknown = JSON.parse(storage.getItem("ef_report_orders_cleared") || "[]");
  const cleared = Array.isArray(previous) ? previous.filter((value): value is string => typeof value === "string") : [];
  if (cleared.includes(orderReference)) return;
  const raw: unknown = JSON.parse(storage.getItem("ef_cart") || "[]");
  if (!Array.isArray(raw)) return;
  const quantities = new Map<string, number>();
  for (const item of purchased) quantities.set(item.priceId, (quantities.get(item.priceId) || 0) + item.qty);
  const remaining = raw.flatMap(item => {
    if (!item || typeof item.priceId !== "string" || !Number.isInteger(item.qty) || item.qty <= 0) return [];
    const bought = quantities.get(item.priceId) || 0;
    quantities.set(item.priceId, Math.max(0, bought - item.qty));
    const qty = Math.max(0, item.qty - bought);
    return qty > 0 ? [{ ...item, qty }] : [];
  });
  storage.setItem("ef_cart", JSON.stringify(remaining));
  storage.setItem("ef_report_orders_cleared", JSON.stringify([...cleared, orderReference].slice(-100)));
}
