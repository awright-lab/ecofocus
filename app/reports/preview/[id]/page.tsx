import ReportPreview from './ReportPreview';

export async function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }));
}

export default function ReportPreviewPage({ params }: any) {
  return <ReportPreview reportId={params.id} />;
}

// Optional: Add SEO metadata for better user experience
export async function generateMetadata({ params }: any) {
  return {
    title: `Report Preview - ${params.id}`,
    description: `Previewing report with ID ${params.id}`,
  };
}

