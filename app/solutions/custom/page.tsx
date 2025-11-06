'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

import CustomHero from './CustomHero';
import CustomOverview from './CustomOverview';
import CustomApproachesGrid from './Approaches';
import CustomWorkflowSteps from './CustomWorkflow';
import CustomDeliverables from './Deliverables';
import CustomUseCasesGrid from './CustomUseCasesGrid';
import CustomMethodsStripe from './CustomMethodsStripe';
import CustomTeamStripe from './CustomTeamStripe';
import CustomFAQ from './CustomFAQ';
import CustomCTA from './CustomCTA';

export default function CustomStudiesPage() {
  return (
    <>
      <Header />

      <main className="bg-white text-gray-900">
        <CustomHero />

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Custom Studies' },
          ]}
          maxWidth="max-w-7xl"
        />

        <CustomOverview />
        <CustomApproachesGrid />
        <CustomWorkflowSteps />
        <CustomDeliverables />
        <CustomUseCasesGrid />
        <CustomMethodsStripe />
        <CustomTeamStripe />
        <CustomFAQ />
        <CustomCTA />
      </main>

      <Footer />
    </>
  );
}





