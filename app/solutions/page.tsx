
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StickyButtons from '../../components/StickyButtons';
import SolutionsHero from './SolutionsHero';
import FinalCTA from './FinalCTA';
import SolutionsOverview from './SolutionsOverview';
import SolutionsHighlights from './SolutionsHighlights';
import SolutionsComparison from './SolutionsComparison';
import TrustSection from './TrustSection';
import SolutionsFeaturedOfferings from './SolutionsFeaturedOfferings'; // <-- add

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <SolutionsHero />
      <SolutionsFeaturedOfferings /> {/* <-- add here */}
      <SolutionsOverview />
      <SolutionsHighlights />
      <SolutionsComparison />
      <TrustSection />
      <FinalCTA />
      <Footer />
      <StickyButtons />
    </div>
  );
}

