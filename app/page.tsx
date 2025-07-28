'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyButtons from '../components/StickyButtons';

import Hero from './home/Hero';
import Study2025 from './home/Study2025';
import CompanyOverview from './home/CompanyOverview';
import FeaturedProduct from './home/FeaturedProduct';
import ServicesOverview from './home/ServicesOverview';
import Partners from './home/Partners';
import DashboardPromo from './home/DashboardPromo';
import SuccessStories from './home/SuccessStories';
import Newsletter from './home/Newsletter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Study2025 />
      <CompanyOverview />
      <FeaturedProduct />
      <ServicesOverview />
      <Partners />
      <DashboardPromo />
      <SuccessStories />
      <Newsletter />
      <Footer />
      <StickyButtons />
    </div>
  );
}

