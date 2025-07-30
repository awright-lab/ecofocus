'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyButtons from '../components/StickyButtons';

import Hero from './home/Hero';
import QuickStats from './home/QuickStats';
import FeaturedReport from './home/FeaturedReport';
import FeaturedDashboard from './home/FeaturedDashboard';
import CoreServices from './home/CoreServices';
import WhyChoose from './home/WhyChoose';
import TrustedBy from './home/TrustedBy';
import CallToAction from './home/CallToAction';
import Newsletter from './home/Newsletter';
import EcoNuggetInsights from './home/EcoNuggetInsights';

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <div className="relative">
        {/* Sections */}
        <div className="relative z-10">
          <FeaturedDashboard />
          <CoreServices />
        </div>

        {/* Gradient Accent Bar positioned between sections */}
        <div className="absolute top-[50%] left-0 w-full h-32 bg-gradient-to-l from-emerald-500 to-blue-500 transform skew-y-6 opacity-30 z-0"></div>
      </div>
      <EcoNuggetInsights />
      <TrustedBy />
      <CallToAction />
      <Footer />
      <StickyButtons />
    </main>
  );
}



