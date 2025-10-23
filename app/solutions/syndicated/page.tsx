'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

import SyndicatedHero from './SyndicatedHero';
import StudyOverview from './StudyOverview';
import TopicsGrid from './TopicsGrid';
import MethodologyStripe from './MethodologyStripe';
import CoverageGrid from './CoverageGrid';
import DifferentiatorsGrid from './DifferentiatorsGrid';
import UseCasesGrid from './UseCasesGrid';
import DataAccessOptions from './DataAccessOptions';
import WhatYouGet from './WhatYouGet';
import SyndicatedReportHighlight from './SyndicatedReportHighlight';
import SampleVisual from './SampleVisual';
import FAQSyndicated from './FAQSyndicated';
import SyndicatedCTA from './SyndicatedCTA';

export default function SyndicatedPage() {
  return (
    <>
      <Header />

      <main className="bg-white text-gray-900">
        <SyndicatedHero />

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Syndicated Study' },
          ]}
          maxWidth="max-w-7xl"
        />

        <StudyOverview />
        <TopicsGrid />
        <MethodologyStripe />
        <CoverageGrid />
        <DifferentiatorsGrid />
        <UseCasesGrid />
        <DataAccessOptions />
        <WhatYouGet />
        <SyndicatedReportHighlight />
        <SampleVisual />
        <FAQSyndicated />
        <SyndicatedCTA />
      </main>

      <Footer />
    </>
  );
}



