'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

import SyndicatedHero from './SyndicatedHero';
import StudyOverview from './StudyOverview';
import TopicsGrid from './TopicsGrid';
import DifferentiatorsGrid from './DifferentiatorsGrid';
import UseCasesGrid from './UseCasesGrid';
import DataAccessOptions from './DataAccessOptions';
import WhatYouGet from './WhatYouGet';
import SampleVisual from './SampleVisual';
import SyndicatedCTA from './SyndicatedCTA';
import MethodologySection from './MethodologySection';

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
        <MethodologySection />
        <DifferentiatorsGrid />
        <UseCasesGrid />
        <DataAccessOptions />
        <SampleVisual />
        <WhatYouGet />
        <SyndicatedCTA />
      </main>

      <Footer />
    </>
  );
}



