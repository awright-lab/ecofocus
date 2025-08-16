// app/reports/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import StoreHero from '@/app/reports/StoreHero';
import FeaturedReport from '@/app/reports/FeaturedReport';
import FeaturedReportsSection from '@/app/reports/FeaturedReportsSection';

import SmallReportsHeader from '@/app/reports/SmallReportsHeader';
import SmallReportsFilterBar from '@/app/reports/SmallReportsFilterBar';
import MetricsStrip from '@/app/reports/MetricsStrip';
import ReportsGrid from '@/app/reports/SmallReportsGrid';
import Pagination from '@/app/reports/Pagination';
import CustomOption from '@/app/reports/CustomOption';

// If you already split types/data:
//   import type { Product } from '@/lib/storeTypes';
//   import { CATALOG } from '@/lib/catalog';
// Otherwise, temporarily use this minimal type and bring your data in here.
type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  img: string;
  category: 'Bundles' | 'Reports';
  year?: number;
};

// TODO: replace with your real data import from '@/lib/catalog'
import { CATALOG } from '@/lib/catalog'; // ← comment this in when available

export default function ReportsPage() {
  // ----- Cart wiring (replace with your real cart integration) -----
  const addToCart = (id: string) => {
    // Hook this to your cart drawer/provider
    console.log('Add to cart:', id);
  };

  // ----- Catalog + Derived Small Reports -----
  const catalog: Product[] = useMemo(() => {
    // If you don't have CATALOG yet, you can inline your array or import it.
    // return YOUR_LOCAL_ARRAY;
    return CATALOG as Product[]; // assumes same shape
  }, []);

  const smallReports = useMemo(
    () => catalog.filter((p) => p.category === 'Reports'),
    [catalog]
  );

  const yearsAvailable = useMemo(() => {
    const yrs = Array.from(
      new Set(smallReports.map((r) => r.year).filter(Boolean))
    ) as number[];
    return yrs.sort((a, b) => b - a);
  }, [smallReports]);

  // ----- Controlled Filters + Pagination -----
  type Year = 'All' | number;
  const [query, setQuery] = useState('');
  const [year, setYear] = useState<Year>('All');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6; // 2 x 3

  const filteredReports = useMemo(() => {
    const q = query.trim().toLowerCase();
    return smallReports.filter((p) => {
      const qOk =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.subtitle ? p.subtitle.toLowerCase().includes(q) : false);
      const yOk = year === 'All' || p.year === year;
      return qOk && yOk;
    });
  }, [smallReports, query, year]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageSlice = filteredReports.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset page when filters change
  const handleQuery = (v: string) => {
    setQuery(v);
    setPage(1);
  };
  const handleYear = (v: Year) => {
    setYear(v);
    setPage(1);
  };

  return (
    <main id="main" className="bg-white">
      <Header />

      {/* HERO */}
      <StoreHero />

      {/* Single Featured Report (directly under hero) */}
      <FeaturedReport
        title="Sustainability Insights Report — 2024"
        subtitle="Comprehensive US consumer sustainability attitudes and behaviors with demographic breakouts."
        price={10000}
        imageSrc="/images/store_sir2024.webp"
        note="Includes read-only Dashboard access"
        ctaPrimary={{ label: 'Add to cart', onClick: () => addToCart('sir-2024'), variant: 'primary' }}
        ctaSecondary={{ label: 'View sample pages', href: '/reports/sir-2024', variant: 'outline' }}
        // badge="FEATURED"
      />

      {/* Three-card Featured Bundles row */}
      <FeaturedReportsSection
        onAddToCart={(id) => addToCart(id)}
      />

      <MetricsStrip />

      {/* Small Reports block */}
      <SmallReportsHeader />
      <SmallReportsFilterBar
        query={query}
        onQuery={handleQuery}
        year={year}
        onYear={handleYear}
        yearsAvailable={yearsAvailable}
      />

      <ReportsGrid
        pageSlice={pageSlice}
        addToCart={addToCart}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        onGoTo={(p) => setPage(p)}
      />

      {/* Custom Research CTA */}
      <CustomOption />

      <Footer />
    </main>
  );
}










