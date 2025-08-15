'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Filter, Check, X, ChevronDown, ArrowRight, BadgePercent, Gift } from 'lucide-react';

/**
 * EcoFocus — Reports & Store (Storefront)
 * - Store-style grid with filters, quick add, and a simple cart drawer
 * - Big-ticket bundles (2025 Study Buy‑In, 2024 Enhance‑Your‑Data, 2024 SIR)
 * - Six Small Reports (SIR subsections) at ~$2k each
 * - Bundled Dashboard access note (Agency/Enterprise/org size)
 * - Fully client-side demo cart; wire to Stripe later
 */

// --- Types ---
type BuyerProfile = 'Brand / Other' | 'Agency' | 'Enterprise';

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number; // in USD
  img: string;
  category: 'Bundles' | 'Reports';
  tags?: string[];
  includes?: string[];
  badge?: string;
  variantNote?: string; // e.g., "Includes Dashboard based on org size"
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

  // --- Catalog ---
  const catalog: Product[] = useMemo(() => ([
    // Big-ticket bundles
    {
      id: 'buyin-2025',
      title: '2025 Syndicated Study — Buy‑In',
      subtitle: 'Add your proprietary questions + receive the full study',
      price: 30000,
      img: '/images/store_2025_buyin.webp',
      category: 'Bundles',
      badge: 'Best value',
      tags: ['2025','Syndicated','Custom Questions','Bundle'],
      includes: [
        'Your proprietary questions fielded with our 2025 study',
        'Copy of the 2025 study deliverables',
        'Custom crosstabs per SOW',
        'Interactive Dashboard access (seats based on org size)'
      ],
      variantNote: 'Dashboard included — seats scale by org size',
    },
    {
      id: 'enhance-2024',
      title: 'Enhance Your Data — 2024',
      subtitle: 'Blend EcoFocus 2024 data with your existing datasets',
      price: 20000,
      img: '/images/store_enhance2024.webp',
      category: 'Bundles',
      tags: ['2024','Data Enrichment','Bundle'],
      includes: [
        'Data integration workshop + alignment',
        'Crosstabs & cohort filters matched to your schema',
        'Interactive Dashboard access (read/write to cohorts as scoped)'
      ],
      variantNote: 'Dashboard included with appropriate license',
    },
    {
      id: 'sir-2024',
      title: 'Sustainability Insights Report — 2024',
      subtitle: 'The flagship 2024 SIR deliverable',
      price: 10000,
      img: '/images/store_sir2024.webp',
      category: 'Bundles',
      tags: ['2024','Report','Flagship'],
      includes: [
        'Full 2024 SIR (PDF + slide-ready charts)',
        'Methodology & key implications',
        'Interactive Dashboard access (read-only seats)'
      ],
      variantNote: 'Dashboard read-only included',
    },
    // Small Reports (SIR subsections)
    {
      id: 'sr-1',
      title: 'SIR Subsection — Demographics & Cohorts',
      subtitle: 'How sustainability varies by age, income, parental status',
      price: 2000,
      img: '/images/store_sr1.webp',
      category: 'Reports',
      tags: ['Subsection','Demographics'],
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    },
    {
      id: 'sr-2',
      title: 'SIR Subsection — Packaging & Recyclability',
      subtitle: 'Perceptions, trust signals, and behavior change',
      price: 2000,
      img: '/images/store_sr2.webp',
      category: 'Reports',
      tags: ['Subsection','Packaging'],
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    },
    {
      id: 'sr-3',
      title: 'SIR Subsection — Corporate Commitments',
      subtitle: 'Expectations of brands and reputational risk',
      price: 2000,
      img: '/images/store_sr3.webp',
      category: 'Reports',
      tags: ['Subsection','Corporate'],
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    },
    {
      id: 'sr-4',
      title: 'SIR Subsection — Purchase Barriers & Price',
      subtitle: 'Affordability, tradeoffs, and willingness to pay',
      price: 2000,
      img: '/images/store_sr4.webp',
      category: 'Reports',
      tags: ['Subsection','Pricing'],
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    },
    {
      id: 'sr-5',
      title: 'SIR Subsection — Channels & Touchpoints',
      subtitle: 'Where sustainability messaging lands and converts',
      price: 2000,
      img: '/images/store_sr5.webp',
      category: 'Reports',
      tags: ['Subsection','Channels'],
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    },
    {
      id: 'sr-6',
      title: 'SIR Subsection — Policy & Education Signals',
      subtitle: 'Recycling policy, curricula, and norms shaping behavior',
      price: 2000,
      img: '/images/store_sr6.webp',
      category: 'Reports',
      tags: ['Subsection','Policy'],
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    },
  ]), []);

  // --- Helpers ---
  const filtered = catalog.filter(p => {
    const catOk = activeCategory === 'All' || p.category === activeCategory;
    const q = query.trim().toLowerCase();
    const qOk = !q || p.title.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q) || p.tags?.some(t=>t.toLowerCase().includes(q));
    return catOk && qOk;
  });

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

  const removeFromCart = (id: string, buyerProfile: BuyerProfile) => setCart(prev => prev.filter(i => !(i.id===id && i.buyer===buyerProfile)));
  const updateQty = (id: string, buyerProfile: BuyerProfile, qty: number) => setCart(prev => prev.map(i => (i.id===id && i.buyer===buyerProfile) ? { ...i, qty: Math.max(1, qty) } : i));

  const itemTotal = (item: CartItem) => {
    const p = catalog.find(c => c.id === item.id)!;
    return p.price * item.qty;
  };

  const subtotal = cart.reduce((sum, item) => sum + itemTotal(item), 0);

  // Simple seat guidance by buyer profile (non-binding, for UI only)
  const seatHint: Record<BuyerProfile, string> = {
    'Brand / Other': 'Includes Dashboard access — seats matched to org size (2–5 typical).',
    'Agency': 'Agency bundle includes Dashboard access; seat counts scale with agency size.',
    'Enterprise': 'Enterprise bundle includes Dashboard access; higher seat caps available.',
  };

  return (
    <main className="min-h-screen bg-white">
      {/* STORE HEADER */}
      <section className="border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold">Reports & Store</h1>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={buyer}
                onChange={(e)=>setBuyer(e.target.value as BuyerProfile)}
                className="appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pr-8 text-sm"
                aria-label="Buyer type"
              >
                <option>Brand / Other</option>
                <option>Agency</option>
                <option>Enterprise</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-500"/>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-gray-300 px-2 py-1 text-sm">
              <button
                className={`rounded-full px-3 py-1 ${activeCategory==='All' ? 'bg-gray-900 text-white' : ''}`}
                onClick={()=>setActiveCategory('All')}
              >All</button>
              <button
                className={`rounded-full px-3 py-1 ${activeCategory==='Bundles' ? 'bg-gray-900 text-white' : ''}`}
                onClick={()=>setActiveCategory('Bundles')}
              >Bundles</button>
              <button
                className={`rounded-full px-3 py-1 ${activeCategory==='Reports' ? 'bg-gray-900 text-white' : ''}`}
                onClick={()=>setActiveCategory('Reports')}
              >Small Reports</button>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm">
              <Filter className="h-4 w-4"/>
              <input
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-44 md:w-60 bg-transparent outline-none"
              />
            </div>

            <button
              onClick={()=>setCartOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white"
            >
              <ShoppingCart className="h-4 w-4"/> Cart
              {cart.length>0 && (
                <span className="ml-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-emerald-700">{cart.length}</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article key={p.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                </div>
                {p.badge && (
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
                    <BadgePercent className="h-3 w-3"/> {p.badge}
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                {p.subtitle && <p className="mt-1 text-sm text-gray-700">{p.subtitle}</p>}

                <div className="mt-3 flex items-baseline gap-2">
                  <div className="text-2xl font-bold">${p.price.toLocaleString()}</div>
                  {p.category==='Bundles' && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Bundle</span>
                  )}
                </div>

                {p.variantNote && (
                  <p className="mt-2 text-xs text-gray-600">{p.variantNote}</p>
                )}

                {p.includes && (
                  <ul className="mt-3 grid gap-1.5 text-sm text-gray-800">
                    {p.includes.slice(0,3).map((inc)=> (
                      <li key={inc} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600"/>{inc}</li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={()=>addToCart(p.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                  >
                    <ShoppingCart className="h-4 w-4"/> Add to cart
                  </button>
                  <Link href={`/reports/${p.id}`} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50">
                    Details <ArrowRight className="h-4 w-4"/>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Seat guidance note */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-semibold">Dashboard Bundling</p>
          <p className="mt-1">{seatHint[buyer]} You can also upgrade seats post‑purchase.</p>
          <div className="mt-2 text-emerald-900 flex items-center gap-2"><Gift className="h-4 w-4"/>Qualified not‑for‑profits receive 20% off.</div>
        </div>
      </section>

      {/* FAQ + Methodology Tease */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold">Quick FAQ</h2>
            <dl className="mt-4 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold">What do the bundles include?</dt>
                <dd className="text-gray-700">Deliverables listed on each product. Bundles include Interactive Dashboard access with seats matched to your organization.</dd>
              </div>
              <div>
                <dt className="font-semibold">Can I add custom questions?</dt>
                <dd className="text-gray-700">Yes — choose the 2025 Syndicated Study Buy‑In to add proprietary questions and receive the full study deliverables.</dd>
              </div>
              <div>
                <dt className="font-semibold">Do you support procurement workflows?</dt>
                <dd className="text-gray-700">Absolutely. We can quote/Invoice and support PO processes. Use the contact option at checkout.</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="text-lg font-bold">Methodology (at a glance)</h3>
            <ul className="mt-2 text-sm text-emerald-900">
              <li>• US Gen Pop, 4,000 completes; MoE ±1.55%</li>
              <li>• Balanced to US Census quotas</li>
              <li>• Annual trendline since 2010 (exceptions 2021, 2023)</li>
            </ul>
            <Link href="/about#methodology" className="mt-3 inline-flex items-center gap-2 font-semibold text-emerald-800 hover:underline">Learn more <ArrowRight className="h-4 w-4"/></Link>
          </div>
        </div>
      </section>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 z-30 h-full w-full max-w-md border-l border-gray-200 bg-white shadow-2xl"
            aria-label="Cart"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="text-lg font-bold">Your Cart</h2>
                <p className="text-xs text-gray-500">Buyer: {buyer} — {seatHint[buyer]}</p>
              </div>
              <button onClick={()=>setCartOpen(false)} className="rounded-full border p-2"><X className="h-4 w-4"/></button>
            </div>

            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-4">
              {cart.length===0 ? (
                <p className="text-sm text-gray-600">Your cart is empty.</p>
              ) : (
                <ul className="grid gap-3">
                  {cart.map((item)=>{
                    const p = catalog.find(c => c.id === item.id)!;
                    return (
                      <li key={item.id + item.buyer} className="flex gap-3 rounded-xl border p-3">
                        <div className="relative h-16 w-24 overflow-hidden rounded-md">
                          <Image src={p.img} alt="" fill className="object-cover"/>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold leading-tight">{p.title}</div>
                              <div className="text-xs text-gray-600">{item.buyer}</div>
                            </div>
                            <div className="text-sm font-bold">${(p.price * item.qty).toLocaleString()}</div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <label className="text-gray-600">Qty</label>
                            <input type="number" min={1} value={item.qty} onChange={(e)=>updateQty(item.id, item.buyer, Number(e.target.value))} className="w-16 rounded border px-2 py-1"/>
                            <button onClick={()=>removeFromCart(item.id, item.buyer)} className="ml-auto text-gray-500 hover:text-gray-900">Remove</button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-lg font-bold">${subtotal.toLocaleString()}</div>
              </div>
              <div className="mt-1 text-xs text-gray-500">Taxes calculated at checkout. NPO discount applied after eligibility review.</div>
              <div className="mt-4 grid gap-2">
                <button
                  onClick={()=>alert('Wire this to Stripe checkout — pass cart + buyer profile')}
                  className="w-full rounded-full bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
                >
                  Checkout
                </button>
                <Link href="/contact" className="mx-auto text-sm font-semibold text-emerald-700 hover:underline">Need an invoice or PO? Contact us</Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}

