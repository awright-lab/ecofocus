'use client';

import Hero from './home/Hero';
import FeaturedReport from './home/FeaturedReport';
import CoreServices from './home/CoreServices';
import WhyChoose from './home/WhyChoose';
import CallToAction from './home/CallToAction';
import Newsletter from './home/Newsletter';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedReport />
      <CoreServices />
      <WhyChoose />
      <CallToAction />
      <Newsletter />
    </main>
  );
}


