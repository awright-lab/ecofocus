import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StickyButtons from '../../components/StickyButtons';
import DashboardHero from './DashboardHero';
import VideoDemo from './VideoDemo';
import FeaturesSection from './FeaturesSection';
import BenefitsSection from './BenefitsSection';
import CTASection from './CTASection';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DashboardHero />
      <VideoDemo />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
      <StickyButtons />
    </div>
  );
}