'use client';

import CoverageGrid from './CoverageGrid';
import DataAccessOptions from './DataAccessOptions';
import DataSnapshotPreview from './DataSnapshotPreview';
import DifferentiatorsGrid from './DifferentiatorsGrid';
import SyndicatedBenefits from './SyndicatedBenefits';
import SyndicatedHero from './SyndicatedHero';
import SyndicatedOverview from './SyndicatedOverview';
import SyndicatedReportHighlight from './SyndicatedReportHighlight';
import TopicsGrid from './TopicsGrid';
import UseCasesGrid from './UseCasesGrid';

export default function SyndicatedResearchPage() {
  return (
    <main className="bg-white text-gray-900">
      <SyndicatedHero />
      <SyndicatedOverview/>
      <SyndicatedBenefits />
      <CoverageGrid />
      <SyndicatedReportHighlight />
      <DataAccessOptions />
      <UseCasesGrid />
      <DifferentiatorsGrid />
      <TopicsGrid />
      <DataSnapshotPreview />

    </main>
  );
}
