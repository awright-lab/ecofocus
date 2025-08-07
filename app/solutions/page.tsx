
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StickyButtons from '../../components/StickyButtons';
import SolutionsHero from './SolutionsHero';
import FinalCTA from './FinalCTA';
import SolutionsOverview from './SolutionsOverview';
import SolutionsHighlights from './SolutionsHighlights';
import SolutionsComparison from './SolutionsComparison';
import TrustSection from './TrustSection';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <SolutionsHero />
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
