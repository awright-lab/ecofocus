// app/solutions/custom/page.tsx
import CustomHero from './CustomHero';
import CustomOverview from './CustomOverview';
import CustomStudyTypes from './CustomStudyTypes';
import CustomProcess from './CustomProcess';
import CustomWhatYouGet from './CustomWhatYouGet';
import CustomUseCasesGrid from './CustomUseCasesGrid';
import CustomDifferentiators from './CustomDifferentiators';
import CustomCTA from './CustomCTA';

export const metadata = {
  title: 'Custom Studies & Consulting | EcoFocus Research',
  description:
    'EcoFocus custom studies apply a proven sustainability framework to your unique business questions—helping you de-risk decisions in brand, innovation, talent, and ESG.',
};

export default function CustomPage() {
  return (
    <main className="min-h-screen bg-white">
      <CustomHero />
      <CustomOverview />
      <CustomStudyTypes />
      <CustomProcess />
      <CustomWhatYouGet />
      <CustomUseCasesGrid />
      <CustomDifferentiators />
      <CustomCTA />
    </main>
  );
}





