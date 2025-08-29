// app/reports/page.tsx
'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ShieldCheck, ShoppingCart } from 'lucide-react';

export default function ReportsForkPage() {
  return (
    <>
      <Header />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reports' }]} />

      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-blue-900/80" />
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Reports</h1>
          <p className="mt-2 text-emerald-100 max-w-2xl">
            Choose paid 2025 reports for purchase, or explore complimentary 2024 downloads.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Link
              href="/reports/paid"
              className="group rounded-2xl bg-white/5 border border-white/15 p-6 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-emerald-300" />
                <h2 className="text-xl font-semibold">Paid Reports</h2>
              </div>
              <p className="mt-2 text-sm text-emerald-50">
                2025 flagship and focused reports. Buy direct or contact our team.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-white/90">
                View paid reports →
              </span>
            </Link>

            <Link
              href="/reports/free"
              className="group rounded-2xl bg-white/5 border border-white/15 p-6 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <h2 className="text-xl font-semibold">Free Reports</h2>
              </div>
              <p className="mt-2 text-sm text-emerald-50">
                Complimentary downloads (email gated), including 2024 SIR and topical slices.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-white/90">
                View free downloads →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
















