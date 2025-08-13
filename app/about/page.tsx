// app/about/page.tsx
import AboutHero from '@/app/about/AboutHero';
//import SnapshotBand from '@/app/about/SnapshotBand';
import MissionApproach from '@/app/about/MissionApproach';
import Leadership from '@/app/about/Leadership';
import MethodologyHighlights from '@/app/about/MethodologyHighlights';
import PartnersBand from '@/app/about/PartnersBand';
import BottomCTA from '@/app/about/BottomCTA';

export default function AboutPage() {
  return (
    <main id="main" className="bg-white">
      <AboutHero />
      <MissionApproach />
      <Leadership />
      <MethodologyHighlights />
      <PartnersBand />
      <BottomCTA />
    </main>
  );
}
