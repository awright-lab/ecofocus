import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyButtons from '../components/StickyButtons';

import Hero from './home/Hero';
//import FeaturedReport from './home/FeaturedReport';
import FeaturedDashboard from './home/FeaturedDashboard';
import CoreServices from './home/CoreServices';
//import WhyChoose from './home/WhyChoose';
import TrustedBy from './home/TrustedBy';
import CallToAction from './home/CallToAction';
//import Newsletter from './home/Newsletter';
import EcoNuggetInsights from './home/EcoNuggetInsights';
import QuickStats from './home/QuickStats';

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <CoreServices />
      <QuickStats />
      <FeaturedDashboard />
      <EcoNuggetInsights />
      <TrustedBy />
      <CallToAction />
      <Footer />
      <StickyButtons />
    </main>
  );
}




