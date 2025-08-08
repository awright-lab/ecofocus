import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyButtons from '../components/StickyButtons';

import Hero from './home/Hero';
import FeaturedDashboard from './home/FeaturedDashboard';
import CoreServices from './home/CoreServices';
//import WhyChoose from './home/WhyChoose';
import TrustedBy from './home/TrustedBy';
import CallToAction from './home/CallToAction';
//import Newsletter from './home/Newsletter';
import EcoNuggetInsights from './home/EcoNuggetInsights';
import QuickStats from './home/QuickStats';
import FeaturedReport from './home/FeaturedReport';
import SayDoGapSection from './home/SayDoGapSection';
import DominoValueChain from './home/DominoValueChain';


export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <CoreServices />
      <QuickStats />
      <SayDoGapSection />
      <FeaturedDashboard />
      <EcoNuggetInsights />
      <DominoValueChain />
      <FeaturedReport />
      <TrustedBy />
      <CallToAction />
      <Footer />
      <StickyButtons />
    </main>
  );
}




