// app/about/page.tsx
import AboutHero from '@/components/about/AboutHero';
import SnapshotBand from '@/components/about/SnapshotBand';
import MissionApproach from '@/components/about/MissionApproach';
import Leadership from '@/components/about/Leadership';
import MethodologyHighlights from '@/components/about/MethodologyHighlights';
import PartnersBand from '@/components/about/PartnersBand';
import BottomCTA from '@/components/about/BottomCTA';

export default function AboutPage() {
  return (
    <main id="main" className="bg-white">
      <AboutHero />
      <SnapshotBand />
      <MissionApproach />
      <Leadership />
      <MethodologyHighlights />
      <PartnersBand />
      <BottomCTA />
    </main>
  );
}
