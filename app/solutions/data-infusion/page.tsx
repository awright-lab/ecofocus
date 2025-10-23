'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

import DataInfusionHero from './DataInfusionHero';
import InfusionOverview from './InfusionOverview';
import InfusionBenefitsGrid from './InfusionBenefitsGrid';
import InfusionMethodsStripe from './InfusionMethodsStripe';
import InfusionWorkflowSteps from './InfusionWorkflowSteps';
import InfusionDeliverables from './InfusionDeliverables';
import InfusionUseCasesGrid from './InfusionUseCasesGrid';
import InfusionTechAndSecurity from './InfusionTechAndSecurity';
import InfusionFAQ from './InfusionFAQ';
import InfusionCTA from './InfusionCTA';

export default function DataInfusionPage() {
  return (
    <>
      <Header />

      <main className="bg-white text-gray-900">
        <DataInfusionHero />

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Data Infusion' },
          ]}
          maxWidth="max-w-7xl"
        />

        <InfusionOverview />
        <InfusionBenefitsGrid />
        <InfusionMethodsStripe />
        <InfusionWorkflowSteps />
        <InfusionDeliverables />
        <InfusionUseCasesGrid />
        <InfusionTechAndSecurity />
        <InfusionFAQ />
        <InfusionCTA />
      </main>

      <Footer />
    </>
  );
}
