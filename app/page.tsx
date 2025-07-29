'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyButtons from '../components/StickyButtons';

import Hero from './home/Hero';
import QuickStats from './home/QuickStats';
import FeaturedReport from './home/FeaturedReport';
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
      <QuickStats />
      <FeaturedReport />
      <CoreServices />
      <WhyChoose />
      <EcoNuggetInsights />
      <TrustedBy />
      <CallToAction />
      <Newsletter />
      <Footer />
      <StickyButtons />
    </main>
  );
}



