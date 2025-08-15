'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Filter, X } from 'lucide-react';

type BuyerProfile = 'Brand / Other' | 'Agency' | 'Enterprise';

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  img: string;
  category: 'Bundles' | 'Reports';
  tags?: string[];
  includes?: string[];
  badge?: string;
  variantNote?: string;
};

type CartItem = {
  id: string;
  qty: number;
  buyer: BuyerProfile;
};

export default function ReportsStorefront() {
  const [buyer, setBuyer] = useState<BuyerProfile>('Brand / Other');
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Bundles' | 'Reports'>('All');
  const [cart, setCart] = useState<CartItem[]>([]);

  const catalog: Product[] = useMemo(() => ([
    {
      id: 'buyin-2025',
      title: '2025 Syndicated Study — Buy-In',
      subtitle: 'Add your proprietary questions + receive the full study',
      price: 30000,
      img: '/images/store_2025_buyin.webp',
      category: 'Bundles',
      badge: 'Best value',
      includes: ['Custom questions in 2025 study', 'Full study deliverables', 'Custom crosstabs', 'Dashboard access (seats scale)'],
      variantNote: 'Dashboard included — seats scale by org size'
    },
    {
      id: 'enhance-2024',
      title: 'Enhance Your Data — 2024',
      subtitle: 'Blend EcoFocus 2024 data with your own',
      price: 20000,
      img: '/images/store_enhance2024.webp',
      category: 'Bundles',
      includes: ['Data integration workshop', 'Crosstabs matched to your schema', 'Dashboard access (licensed)'],
      variantNote: 'Dashboard included with license'
    },
    {
      id: 'sir-2024',
      title: 'Sustainability Insights Report — 2024',
      subtitle: 'Flagship 2024 SIR deliverable',
      price: 10000,
      img: '/images/store_sir2024.webp',
      category: 'Bundles',
      includes: ['Full 2024 SIR (PDF + charts)', 'Methodology & implications', 'Read-only dashboard seats'],
      variantNote: 'Dashboard read-only included'
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `sr-${i + 1}`,
      title: `SIR Subsection — Category ${i + 1}`,
      subtitle: 'Focused subsection from SIR',
      price: 2000,
      img: `/images/store_sr${i + 1}.webp`,
      category: 'Reports' as const,
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    }))
  ]), []);

  const addToCart = (id: string) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === id && i.buyer === buyer);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { id, qty: 1, buyer }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string, buyerProfile: BuyerProfile) => setCart(prev => prev.filter(i => !(i.id === id && i.buyer === buyerProfile)));
  const updateQty = (id: string, buyerProfile: BuyerProfile, qty: number) => setCart(prev => prev.map(i => (i.id === id && i.buyer === buyerProfile) ? { ...i, qty: Math.max(1, qty) } : i));

  const itemTotal = (item: CartItem) => {
    const p = catalog.find(c => c.id === item.id)!;
    return p.price * item.qty;
  };

  const subtotal = cart.reduce((sum, item) => sum + itemTotal(item), 0);

  const seatHint: Record<BuyerProfile, string> = {
    'Brand / Other': 'Dashboard access — seats matched to org size (2–5 typical).',
    'Agency': 'Agency bundle includes dashboard; seats scale with agency size.',
    'Enterprise': 'Enterprise bundle includes dashboard; higher seat caps available.'
  };

  // helper to filter by activeCategory/query for each section
  const matchesFilters = (p: Product) => {
    const catOk = activeCategory === 'All' || p.category === activeCategory;
    const q = query.trim().toLowerCase();
    const qOk = !q || p.title.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q));
    return catOk && qOk;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER */}
      <section className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center gap-3 px-4 py-4">
          <h1 className="text-xl md:text-2xl font-bold">Reports & Store</h1>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select value={buyer} onChange={(e) => setBuyer(e.target.value as BuyerProfile)} className="rounded-full border px-4 py-2 text-sm">
              <option>Brand / Other</option>
              <option>Agency</option>
              <option>Enterprise</option>
            </select>
            <div className="flex items-center gap-2 rounded-full border px-2 py-1 text-sm">
              <button className={`${activeCategory === 'All' ? 'bg-gray-900 text-white' : ''} rounded-full px-3 py-1`} onClick={() => setActiveCategory('All')}>All</button>
              <button className={`${activeCategory === 'Bundles' ? 'bg-gray-900 text-white' : ''} rounded-full px-3 py-1`} onClick={() => setActiveCategory('Bundles')}>Bundles</button>
              <button className={`${activeCategory === 'Reports' ? 'bg-gray-900 text-white' : ''} rounded-full px-3 py-1`} onClick={() => setActiveCategory('Reports')}>Small Reports</button>
            </div>
            <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
              <Filter className="h-4 w-4" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="w-44 md:w-60 bg-transparent outline-none" />
            </div>
            <button onClick={() => setCartOpen(true)} className="relative inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white">
              <ShoppingCart className="h-4 w-4" /> Cart
              {cart.length > 0 && <span className="ml-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-emerald-700">{cart.length}</span>}
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED BUNDLES */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalog.filter(p => p.category === 'Bundles').filter(matchesFilters).map(p => (
            <article key={p.id} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src={p.img} alt={p.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-700">{p.subtitle}</p>
                <div className="mt-2 text-2xl font-bold">${p.price.toLocaleString()}</div>
                {p.variantNote && <p className="mt-1 text-xs text-gray-600">{p.variantNote}</p>}
                <div className="mt-4 flex gap-3">
                  <button onClick={() => addToCart(p.id)} className="rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold"><ShoppingCart className="h-4 w-4" /> Add</button>
                  <Link href={`/reports/${p.id}`} className="rounded-full border px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50">Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* COMPACT GRID FOR SMALL REPORTS */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-4">Small Reports</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {catalog.filter(p => p.category === 'Reports').filter(matchesFilters).map(p => (
            <article key={p.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="relative aspect-square">
                <Image src={p.img} alt={p.title} fill className="object-cover" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold leading-tight">{p.title}</h3>
                <div className="mt-1 text-emerald-700 font-bold text-sm">${p.price.toLocaleString()}</div>
                <button onClick={() => addToCart(p.id)} className="mt-2 w-full rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"><ShoppingCart className="h-3 w-3" /> Add</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed right-0 top-0 z-30 h-full w-full max-w-md border-l bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="text-lg font-bold">Your Cart</h2>
                <p className="text-xs text-gray-500">Buyer: {buyer} — {seatHint[buyer]}</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="rounded-full border p-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-4">
              {cart.length === 0 ? <p className="text-sm text-gray-600">Your cart is empty.</p> : (
                <ul className="grid gap-3">
                  {cart.map(item => {
                    const p = catalog.find(c => c.id === item.id)!;
                    return (
                      <li key={item.id + item.buyer} className="flex gap-3 rounded-xl border p-3">
                        <div className="relative h-16 w-24 overflow-hidden rounded-md">
                          <Image src={p.img} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="font-semibold text-sm">{p.title}</div>
                            <div className="text-sm font-bold">${(p.price * item.qty).toLocaleString()}</div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <label>Qty</label>
                            <input type="number" min={1} value={item.qty} onChange={(e) => updateQty(item.id, item.buyer, Number(e.target.value))} className="w-14 rounded border px-1" />
                            <button onClick={() => removeFromCart(item.id, item.buyer)} className="ml-auto text-gray-500">Remove</button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="border-t p-4">
              <div className="flex justify-between">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-lg font-bold">${subtotal.toLocaleString()}</div>
              </div>
              <div className="mt-4 grid gap-2">
                <button onClick={() => alert('Proceed to checkout')} className="w-full rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white">Checkout</button>
                <Link href="/contact" className="text-sm font-semibold text-emerald-700">Need an invoice? Contact us</Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}



