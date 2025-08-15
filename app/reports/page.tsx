'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Filter, X } from 'lucide-react';

// If your site uses global Header/Footer, you can remove these imports.
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type BuyerProfile = 'Brand / Other' | 'Agency' | 'Enterprise';

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  img: string;
  category: 'Bundles' | 'Reports';
  year?: number; // for small reports filtering
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
  const [buyer] = useState<BuyerProfile>('Brand / Other');
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState(''); // applies only to small reports
  const [year, setYear] = useState<'All' | 2024 | 2025>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState(1); // pagination for small reports
  const PAGE_SIZE = 6; // 2 x 3 grid

  const reduceMotion = useReducedMotion();


  const catalog: Product[] = useMemo(() => ([
    // --- FEATURED BUNDLES (hero cards) ---
    {
      id: 'buyin-2025',
      title: '2025 Syndicated Study — Buy‑In',
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
      includes: ['Full 2024 SIR (PDF + charts)', 'Methodology & implications', 'Read‑only dashboard seats'],
      variantNote: 'Dashboard read‑only included'
    },
    // --- SMALL REPORTS (SIR subsections; yearly releases) ---
    // 2025 set
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `sr-2025-${i + 1}`,
      title: `SIR Subsection — Category ${i + 1} (2025)`,
      subtitle: 'Focused subsection from SIR',
      price: 2000,
      img: `/images/store_sr${(i % 6) + 1}.webp`,
      category: 'Reports' as const,
      year: 2025 as const,
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    })),
    // 2024 set (example duplicates with year 2024)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `sr-2024-${i + 1}`,
      title: `SIR Subsection — Category ${i + 1} (2024)`,
      subtitle: 'Focused subsection from SIR',
      price: 2000,
      img: `/images/store_sr${(i % 6) + 1}.webp`,
      category: 'Reports' as const,
      year: 2024 as const,
      includes: ['Section PDF', 'Key charts pack', 'Usage license']
    })),
  ]), []);

  // --- Cart helpers ---
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

  // --- Small Reports filtering & pagination ---
  const smallReports = catalog.filter(p => p.category === 'Reports');
  const yearsAvailable = Array.from(new Set(smallReports.map(r => r.year))).filter(Boolean).sort((a, b) => (b as number) - (a as number)) as number[];

  const filteredReports = smallReports.filter(p => {
    const q = query.trim().toLowerCase();
    const qOk = !q || p.title.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q);
    const yOk = year === 'All' || p.year === year;
    return qOk && yOk;
  });

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageSlice = filteredReports.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // reset to page 1 when filters change
  const handleSearch = (v: string) => { setQuery(v); setPage(1); };
  const handleYear = (v: 'All' | 2024 | 2025) => { setYear(v); setPage(1); };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* HERO (homepage-inspired, video + diagonal overlay) */}
        <section
          aria-labelledby="reports-hero"
          className="relative isolate overflow-hidden text-white min-h-[60svh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center"
        >
          {/* Background media */}
          <div className="absolute inset-0 -z-20">
            {!reduceMotion ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/images/storefront-hero-poster.jpg"
                className="h-full w-full object-cover object-[30%_50%] brightness-[1.1] contrast-[1.05] saturate-[1.05]"
              >
                <source src="/videos/storefront-hero.webm" type="video/webm" />
                <source src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-7.mp4" type="video/mp4" />
              </video>
            ) : (
              <Image
                src="/images/storefront-hero-poster.jpg"
                alt=""
                fill
                priority
                className="object-cover object-[30%_50%] brightness-[1.08] contrast-[1.05] saturate-[1.05]"
              />
            )}
          </div>

          {/* Diagonal overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="h-full w-full bg-gradient-to-br from-emerald-900/95 to-blue-900/95 [clip-path:polygon(0%_0%,_46%_0%,_74%_100%,_0%_100%)] md:[clip-path:polygon(0%_0%,_36%_0%,_58%_100%,_0%_100%)] lg:[clip-path:polygon(0%_0%,_28%_0%,_50%_100%,_0%_100%)]" />
          </div>

          {/* Soft scrim */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="h-full w-full bg-gradient-to-br from-black/45 via-emerald-950/35 to-blue-950/45" />
          </div>

          {/* Content */}
          <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 py-14 sm:py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-[52rem]"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Storefront
              </div>

              <h1 id="reports-hero" className="mb-3 font-bold leading-[1.05] text-[clamp(2rem,6vw,3.5rem)] [text-wrap:balance] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                Sustainability intelligence, <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">packaged for action</span>.
              </h1>

              <p className="max-w-[40rem] text-gray-100/90">
                Explore flagship studies, enhance your data, or pick focused subsections. Eligible purchases include Interactive Dashboard access.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="#bundles" className="rounded-full bg-white/90 px-5 py-2.5 text-emerald-900 font-semibold shadow hover:bg-white">Featured bundles</Link>
                <Link href="#reports" className="rounded-full border border-white/60 bg-white/10 px-5 py-2.5 font-semibold text-white hover:bg-white/20">Small reports</Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURED BUNDLES (Hero cards) */}
        <section id="bundles" className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {catalog.filter(p => p.category === 'Bundles').map(p => (
              <motion.article
                key={p.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={p.img} alt={p.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-700">{p.subtitle}</p>
                  <div className="mt-2 text-2xl font-bold">${p.price.toLocaleString()}</div>
                  {p.variantNote && <p className="mt-1 text-xs text-gray-600">{p.variantNote}</p>}
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => addToCart(p.id)} className="rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-emerald-700">Add to cart</button>
                    <Link href={`/reports/${p.id}`} className="rounded-full border px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50">Details</Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FILTER BAR — applies ONLY to small reports */}
        <section className="border-y border-gray-200 bg-white/70">
          <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-3">
            <div className="text-sm font-semibold text-gray-900">Filter Small Reports</div>
            <div className="ml-auto flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
              <Filter className="h-4 w-4" />
              <input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search small reports…" className="w-48 md:w-64 bg-transparent outline-none" />
            </div>
            <select value={year} onChange={(e) => handleYear((e.target.value === 'All' ? 'All' : Number(e.target.value)) as 'All' | 2024 | 2025)} className="rounded-full border px-4 py-2 text-sm">
              <option value="All">All years</option>
              {yearsAvailable.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </section>

        {/* METRICS STRIP (homepage-style) */}
        <section className="border-y border-gray-200 bg-gray-50">
          <div className="container mx-auto grid grid-cols-3 gap-4 px-4 py-6 text-center">
            <div>
              <div className="text-2xl font-bold">13+</div>
              <div className="text-sm text-gray-600">Years of Trend Data</div>
            </div>
            <div>
              <div className="text-2xl font-bold">90,000+</div>
              <div className="text-sm text-gray-600">Data Points Collected</div>
            </div>
            <div>
              <div className="text-2xl font-bold">± 1.55%</div>
              <div className="text-sm text-gray-600">Margin of Error</div>
            </div>
          </div>
        </section>

        {/* SMALL REPORTS — 2 x 3 paginated grid */}
        <section id="reports" className="container mx-auto px-4 py-10">
          {pageSlice.length === 0 ? (
            <p className="text-gray-600">No small reports match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageSlice.map(p => (
                <article key={p.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image src={p.img} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold leading-tight">{p.title}</h3>
                    <div className="mt-1 text-sm text-gray-600">{p.year}</div>
                    <div className="mt-2 text-emerald-700 font-bold">${p.price.toLocaleString()}</div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => addToCart(p.id)} className="rounded-full bg-emerald-600 px-4 py-2 text-white text-sm font-semibold"><ShoppingCart className="h-4 w-4" /> Add</button>
                      <Link href={`/reports/${p.id}`} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">Details</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-full border px-3 py-1.5 text-sm disabled:opacity-40">Prev</button>
            <div className="text-sm">Page {currentPage} of {totalPages}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-full border px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
          </div>
        </section>

        {/* CUSTOM OPTION CALLOUT */}
        <section className="container mx-auto px-4 pb-16">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold">Need something custom?</h3>
            <p className="mt-2 text-gray-800 max-w-3xl">Don’t see what you’re looking for? We can tailor research, integrate with your data, or build a bespoke mini‑study for your team.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/solutions/custom-research" className="rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold">Read more</Link>
              <Link href="/contact" className="rounded-full border border-emerald-300 px-5 py-2.5 font-semibold text-emerald-800 hover:bg-emerald-100">Schedule a discovery call</Link>
            </div>
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

      <Footer />
    </>
  );
}






