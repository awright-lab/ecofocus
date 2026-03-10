import { HelpCenterClient } from "@/components/portal/HelpCenterClient";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalArticleCategories, getPortalArticles } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Knowledge Base",
  "Private knowledge base and help center for the EcoFocus portal.",
);

export default async function HelpCenterPage() {
  await requirePortalAccess("/portal/help");
  const articles = getPortalArticles();
  const categories = getPortalArticleCategories();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Knowledge Base"
          title="Help center"
          description="Search and filter realistic EcoFocus and Displayr-oriented help content covering login, exports, Eco IQ interpretation, filters, and data table workflows."
        />
      </section>

      <HelpCenterClient articles={articles} categories={categories} />
    </div>
  );
}
