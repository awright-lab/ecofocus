// store/cart.tsx
"use client";

import { checkoutPrices } from "@/lib/checkout";
import { createContext, useContext, useEffect, useState } from "react";

type Item = { priceId: string; title: string; qty: number };
type Ctx = {
  ready: boolean;
  items: Item[];
  add: (i: Item) => void;
  remove: (priceId: string) => void;
  clear: () => void;
  checkout: () => Promise<void>;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const syncCart = () => {
      try {
        const parsed: unknown = JSON.parse(localStorage.getItem("ef_cart") || "[]");
        if (Array.isArray(parsed)) setItems(parsed.filter((item): item is Item =>
          item && typeof item.priceId === "string" && typeof item.title === "string" && Number.isInteger(item.qty) && item.qty > 0 && item.qty <= 100
        ));
      } catch { /* An unreadable cart starts empty. */ }
      setHydrated(true);
    };
    syncCart();
    window.addEventListener("ef:cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("ef:cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);
  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem("ef_cart", JSON.stringify(items)); } catch { /* The cart still works for this visit. */ }
    }
  }, [items, hydrated]);

  function add(i: Item) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.priceId === i.priceId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(100, next[idx].qty + i.qty) };
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
    if (!items.length) throw new Error("Add a report before checking out.");
    await checkoutPrices(items.map(i => ({ price: i.priceId, quantity: i.qty })));
  }

  const value: Ctx = { ready: hydrated, items, add, remove, clear, checkout };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
