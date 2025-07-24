'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StickyButtons from '../../components/StickyButtons';
import ReportsHero from './ReportsHero';
import FeaturedReports from './FeaturedReports';
import ReportCategories from './ReportCategories';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ReportsHero />
      <FeaturedReports />
      <ReportCategories />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <StickyButtons />
    </div>
  );
}