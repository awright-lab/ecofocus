import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StickyButtons from '../../components/StickyButtons';
import AboutHero from './AboutHero';
import MissionSection from './MissionSection';
import TeamSection from './TeamSection';
import StatsSection from './StatsSection';
import ValuesSection from './ValuesSection';
import CTASection from './CTASection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AboutHero />
        <MissionSection />
        <StatsSection />
        <ValuesSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
      <StickyButtons />
    </div>
  );
}