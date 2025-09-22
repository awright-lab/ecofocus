// store/cart.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Item = { priceId: string; title: string; qty: number };
type Ctx = {
  items: Item[];
  add: (i: Item) => void;
  remove: (priceId: string) => void;
  clear: () => void;
  checkout: () => Promise<void>;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("ef_cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("ef_cart", JSON.stringify(items));
  }, [items]);

  function add(i: Item) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.priceId === i.priceId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + i.qty };
        return next;
      }
      return [...prev, i];
    });
  }
  function remove(priceId: string) {
    setItems((prev) => prev.filter((p) => p.priceId !== priceId));
  }
  function clear() {
    setItems([]);
  }
  async function checkout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ price: i.priceId, quantity: i.qty })),
        successUrl: `${location.origin}/reports?order=success`,
        cancelUrl: `${location.href}`,
      }),
    });
    const data = await res.json();
    if (data.url) location.href = data.url;
  }

  const value = useMemo<Ctx>(() => ({ items, add, remove, clear, checkout }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
