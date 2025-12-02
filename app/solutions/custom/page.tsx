'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import CustomHero from './CustomHero';
import CustomOverview from './CustomOverview';
// If you already have a FAQ component for custom, you can keep it:
import BenefitsGrid from './BenefitsGrid';
import CoverageGrid from './CoverageGrid';
import TopicsGrid from './TopicsGrid';
import CustomDifferentiators from './CustomDifferentiators';
import SnapshotPreview from './SnapshotPreview';
import CustomMethodologyStripe from './CustomMethodsStripe';
import WhatYouGet from './WhatYouGet';
import UseCasesGrid from './UseCases';
import AccessOptions from './AccessOptions';
import CTA from './FinalCTA';

export default function CustomStudiesPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <CustomHero />

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Custom Studies', href: '/solutions/custom' },
          ]}
        />

        <CustomOverview />
        <BenefitsGrid />
        <CustomMethodologyStripe />
        <CoverageGrid />
        <TopicsGrid />
        <CustomDifferentiators />
        <SnapshotPreview />
        <WhatYouGet />
        <UseCasesGrid />
        <AccessOptions />
        <CTA />
      </main>

      <Footer />
    </>
  );
}






