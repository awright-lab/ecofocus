
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StickyButtons from '../../components/StickyButtons';
import SolutionsHero from './SolutionsHero';
//import ServicesOverview from './ServicesOverview';
import ProcessSection from './ProcessSection';
import IndustriesSection from './IndustriesSection';
import TechnologySection from './TechnologySection';
import CTASection from './CTASection';
import SolutionsOverview from './SolutionsOverview';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <SolutionsHero />
      <SolutionsOverview />
      <ProcessSection />
      <IndustriesSection />
      <TechnologySection />
      <CTASection />
      <Footer />
      <StickyButtons />
    </div>
  );
}
