'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

import CustomHero from './CustomHero';
import CustomOverview from './CustomOverview';
import CustomDesignLevers from './CustomDesignLevers';
import CustomMethodologySection from './CustomMethodologySection';
import CustomWhyEcoFocus from './CustomWhyEcoFocus';
import CustomUseCasesGrid from './CustomUseCasesGrid';
import CustomAccessPoints from './CustomAccessPoints';
import CustomSampleOutput from './CustomSampleOutput';
import CustomWhatYouGet from './CustomWhatYouGet';
import CustomCTA from './CustomCTA';
// If you already have a FAQ component for custom, you can keep it:
import CustomFAQ from './CustomFAQ';

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
        <CustomDesignLevers />
        <CustomMethodologySection />
        <CustomWhyEcoFocus />
        <CustomUseCasesGrid />
        <CustomAccessPoints />
        <CustomSampleOutput />
        <CustomWhatYouGet />
        <CustomCTA />
        <CustomFAQ />
      </main>

      <Footer />
    </>
  );
}






