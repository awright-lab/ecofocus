import type { Metadata } from 'next';
import Link from 'next/link';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickySectionNav from '@/components/StickySectionNav';
import Accordion from '@/components/Accordion';
import AgencyVideoPlayer from '@/components/AgencyVideoPlayer';

export const metadata: Metadata = {
  title: {
    absolute: 'EcoFocus for Agencies | Win RFPs + De-Risk Sustainability Messaging',
  },
  description:
    'EcoFocus gives agencies nationally representative sustainability insights to win RFPs, de-risk claims, and deliver defensible strategy—fast.',
  alternates: {
    canonical: '/agencies',
  },
};

const SECTION_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'why-now', label: 'Why Now' },
  { id: 'purpose-generation', label: 'Purpose Generation' },
  { id: 'agency-advantage', label: 'Elevator Pitch' },
  { id: 'winning', label: 'Winning' },
  { id: 'data-breadth', label: 'Data Breadth' },
  { id: 'defensible', label: 'Defensible Data' },
  { id: 'roi', label: 'Client ROI' },
  { id: 'portal', label: 'Portal' },
  { id: 'modules', label: 'Modules' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'guarantee', label: 'Guarantee' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;

const CHAPTERS = [
  { time: 0, label: 'Why agencies care' },
  { time: 100, label: 'The purpose-driven generation' },
  { time: 200, label: 'What’s inside the data' },
  { time: 340, label: 'How agencies win RFPs' },
  { time: 470, label: 'Portal walkthrough' },
  { time: 585, label: 'Pricing & seats' },
  { time: 645, label: 'Guarantee & next steps' },
] as const;

const DATA_BREADTH_ITEMS = [
  {
    id: 'breadth-1',
    title: 'Environmental and Health Consciousness',
    bullets: [
      'Environmental, health, and economic decision-making factors (Q3)',
      'Climate change attitudes (Q9B2, QInformed) and chemical anxieties—PFAS, microplastics, BPA, phthalates, lead, formaldehyde, heavy metals (Q9A)',
      'Information sources for chemical safety (T1) and trust in environmental claims (QTrust, T3)',
      'Learning interests across environmental and health topics (Q11c)',
      'Personal activism and engagement behaviors (QActivism)',
      'Personal values and belief statements (Q9D2)',
    ],
  },
  {
    id: 'breadth-2',
    title: 'Shopping Behaviors and Brand Relationships',
    bullets: [
      'The intention-action gap in eco-friendly purchasing (Q3, Q4a vs. Q5c, BA1N)',
      'Affordability and availability barriers (Q5c-A1, Q5c-A4)',
      'Brand trust (T3, T4) and loyalty drivers (Q15)',
      'Willingness to pay premiums for sustainable, healthy, and local products (Q4a-E4, Q4a-J4, Q4a-K1)',
      'Avoidance of companies with poor environmental or social practices (Q4a-K2, Q4a-K3)',
      'Top product categories where consumers seek sustainable options (QPROD_CAT)',
      'Expected changes in eco-friendly purchasing over next 12 months (Q3b)',
      'Connection between personal health and environmental choices (QH1)',
    ],
  },
  {
    id: 'breadth-3',
    title: 'Packaging Intelligence',
    bullets: [
      'Material preferences and recyclability expectations (Q20a, Q20b)',
      'Chemical safety concerns and leaching awareness (Q20b-4, Q20b-10, Q20K, QGPI1)',
      'Certification awareness (Q20d), understanding (Q20d1), and influence (Q20e, MC2_B)',
      'Packaging features that drive purchases (QP1)',
      'Trends in reusable, refillable, and alternative packaging (Q20a-3, QGPI2, QGPI3, QGPI4, QGPI5)',
      'EPR awareness (EPR1), support (EPR2), concerns (EPR3), and impact on purchasing (EPR4)',
      'Concerns about and actions taken regarding product packaging (PACK_CONC1, PACK_CONC2)',
    ],
  },
  {
    id: 'breadth-4',
    title: 'Workplace Sustainability',
    bullets: [
      'Familiarity with employer environmental commitments (E1)',
      'Current workplace environmental practices and programs (E2, E3)',
      'Perceptions of workplace environmental responsibility (E4)',
      'How commitments affect recruitment (E7) and retention (E6)',
      'Participation in sustainability programs (E5)',
      'Satisfaction with employer efforts (E8)',
      'Availability of environmental training (E9)',
    ],
  },
  {
    id: 'breadth-5',
    title: 'Category-Specific Insights',
    bullets: [
      'Grocery patterns (Q24b, BA1N) and label reading (PL1, GR1, GR2)',
      'Personal care preferences (PCP1-PCP7) and household cleaning preferences (HCP1-HCP7)',
      'Third-party certification influence (GR3, PCP3, HCP3)',
      'Category-specific importance factors (GR4, PCP4, HCP4)',
      'Ingredient and chemical avoidance (GR5, PCP5, HCP5)',
      'Info sources for safer products (GR6, PCP6, HCP6)',
      'Health-environment connection beliefs (GR7, PCP7, HCP7, QH1)',
      'Pet product purchasing (QPET1-QPET4), “pet parent paradox,” and interest in plant-based pet foods (QPET5-QPET7)',
    ],
  },
  {
    id: 'breadth-6',
    title: 'Brand Ratings and Perceptions',
    bullets: [
      'Brand awareness across home improvement/solar, CPG, apparel, and pet product industries (QBRAND_A)',
      'Purchase history and future purchase intentions (QBRAND_B1, QBRAND_B2)',
      'Consumer perceptions of brand eco-friendliness (QBRAND_C)',
      'Competitive benchmarking across sectors',
    ],
  },
  {
    id: 'breadth-7',
    title: 'Media and Messaging',
    bullets: [
      'News and information sources (QNEWSP30) and social media platform usage (QSocialP30)',
      'Where consumers get info about eco-friendly products (QINFO1)',
      'What makes social media eco-info trustworthy (QINFO2)',
      'Social media influence on eco-purchasing decisions (QINFO3)',
      'Which platforms consumers trust for different environmental info (QINFO4)',
      'Trust in sources—scientists, government, organizations, corporations, influencers (QTrust)',
      'Preferred channels for brands’ environmental practices (T5)',
      'Messaging effectiveness testing (QMessaging1-5): personal vs. planetary; general vs. specific; material vs. moral; climate vs. biodiversity; organic vs. regenerative',
    ],
  },
  {
    id: 'breadth-8',
    title: 'Segmentation',
    bullets: [
      'Age (S1), Income (S7), Education (S8), Parental status (S5)',
      'Geography (S10a, S10b, S10c), Home ownership (S10d), Employment (S11)',
      'Pet ownership (QPET1), Political affiliation (Q40)',
      'Ethnicity (S9, D6), Gender (S2)',
    ],
  },
] as const;

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    title: 'Is the data nationally representative?',
    content:
      'Yes. EcoFocus uses a nationally representative US adult sample balanced to key census characteristics.',
  },
  {
    id: 'faq-2',
    title: 'How large is the sample?',
    content:
      'The core study sample is 4,000 respondents, supporting robust subgroup analysis and strategic confidence.',
  },
  {
    id: 'faq-3',
    title: 'Can we segment by audience demographics?',
    content:
      'Yes. You can segment by age, income, education, parental status, geography, home ownership, employment, political affiliation, ethnicity, gender, and more.',
  },
  {
    id: 'faq-4',
    title: 'Do you offer onboarding and support?',
    content:
      'Yes. Seat license plans include onboarding sessions and recurring consultation support.',
  },
  {
    id: 'faq-5',
    title: 'Can EcoFocus help validate sustainability claims?',
    content:
      'Yes. Agencies use EcoFocus to pressure-test claims and messaging so recommendations remain credible and defensible.',
  },
  {
    id: 'faq-6',
    title: 'Can agencies use EcoFocus in pitches and client work?',
    content:
      'Yes. EcoFocus is built to support both pitch development and ongoing delivery work.',
  },
  {
    id: 'faq-7',
    title: 'How do seat licenses work?',
    content:
      'Seat licenses are tied to your plan tier and include a set number of user seats plus module access and support.',
  },
] as const;

function getConfiguredSlideImages() {
  const configured = process.env.NEXT_PUBLIC_AGENCY_SLIDES ?? '';
  return configured
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function sectionClassName(id: string) {
  return `scroll-mt-28 px-6 py-14 sm:px-8 lg:px-12 ${id === 'overview' ? 'pt-16' : ''}`;
}

export default function AgenciesPage() {
  const slideImages = getConfiguredSlideImages();

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-white via-emerald-50/30 to-white text-gray-900">
        <section id="overview" className={sectionClassName('overview')}>
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.35fr,1fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Agencies
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Turn Sustainability Into an RFP Advantage
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-gray-700">
                EcoFocus becomes both a pitch engine and a delivery engine for advertising, marketing, PR and comms
                teams, giving you self-serve access to nationally representative insights on the purpose-driven
                generation and how sustainability values translate into real purchasing behavior.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo" className="btn-primary-emerald">
                  Schedule a Demo
                </Link>
                <a href="#data-breadth" className="btn-secondary-light">
                  Explore Data Breadth
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Elevator Snapshot</h2>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li>Win RFPs with category-specific, behavior-linked sustainability insights.</li>
                <li>De-risk messaging with claims prioritization grounded in national data.</li>
                <li>Publish always-on POV content anchored in current consumer evidence.</li>
              </ul>
            </div>
          </div>
        </section>

        <StickySectionNav items={[...SECTION_ITEMS]} mobileLabel="Jump to section" />

        <section id="why-now" className={sectionClassName('why-now')}>
          <div className="mx-auto max-w-5xl rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-gray-900">So Why Now?</h2>
            <p className="mt-4 text-lg italic text-gray-700">
              2030 is right around the corner. The time for companies to prepare for this huge shift in consumer
              purchasing power is NOW.
            </p>
            <p className="mt-4 text-2xl font-extrabold text-emerald-700">Be Early or Be Late</p>
          </div>
        </section>

        <section id="purpose-generation" className={sectionClassName('purpose-generation')}>
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-semibold text-gray-900">The Purpose-Driven Generation</h2>
            <p className="mt-4 text-lg font-medium text-emerald-800">
              Millennials and Gen Z will make up 65% of purchasing power by 2030*
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-6 text-gray-700">
              <li>The Purpose-Driven Generation is reshaping the consumer landscape.</li>
              <li>
                These are individuals, largely Gen Z, Millennials, and increasingly younger Gen Xers, whose values
                directly influence how they shop,
              </li>
              <li>What they advocate for, and which brands they trust.</li>
              <li>They care about ethical sourcing, environmental impact, and corporate transparency.</li>
            </ul>
            <p className="mt-6 text-gray-700">
              They prioritize sustainability, health, and ethics, not just in what they buy, but in who they buy from.
              Purpose isn’t just a value proposition. It’s the new margin-friendly differentiation and growth driver.
            </p>
            <p className="mt-4 text-sm text-gray-500">*Source: NielsenIQ/tPX White Paper</p>
          </div>
        </section>

        <section id="agency-advantage" className={sectionClassName('agency-advantage')}>
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-semibold text-gray-900">Elevator Pitch</h2>
            <p className="mt-4 text-gray-700">
              For advertising, marketing, PR and Comms firms, EcoFocus becomes both a pitch engine and a delivery
              engine. Use our data to:
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-6 text-gray-700">
              <li>
                Win RFPs with category-specific insights showing how sustainability attitudes correlate with consumer
                behaviors,
              </li>
              <li>
                De-risk messaging by prioritizing the claims that resonate most strongly with target audiences, and
              </li>
              <li>
                Produce always-on POV (thought-leadership, earned stories, social) grounded in the latest nationally
                representative consumer research.
              </li>
            </ul>
          </div>
        </section>

        <section id="winning" className={sectionClassName('winning')}>
          <div className="mx-auto max-w-6xl rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-gray-900">Winning</h2>
            <p className="mt-4 text-gray-700">
              Agencies win when they can turn cultural signals into commercial outcomes, and that’s exactly what
              EcoFocus delivers. Our Portal gives you interactive, self-serve access to nationally representative
              insights on the purpose-driven generation (Gen Z & Millennials) and how they differ from older
              consumers.
            </p>
            <ul className="mt-5 grid gap-3 text-gray-700 sm:grid-cols-2">
              <li className="rounded-lg bg-emerald-50 p-3">Which sustainability certifications and messages resonate</li>
              <li className="rounded-lg bg-emerald-50 p-3">Which fail to drive behavior</li>
              <li className="rounded-lg bg-emerald-50 p-3">What builds trust in environmental claims</li>
              <li className="rounded-lg bg-emerald-50 p-3">
                How environmental values correlate with purchasing patterns across categories
              </li>
            </ul>
            <p className="mt-6 text-sm text-gray-600">
              For example: 80% of respondents say they are aware of the USDA Organic certification, but only 41% are
              aware of the USDA Bio-based Product seal.
            </p>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">Slide Strip</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {slideImages.length > 0
                  ? slideImages.map((src) => (
                      <div
                        key={src}
                        className="relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="Agency slide" className="h-44 w-full object-cover" />
                      </div>
                    ))
                  : Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`placeholder-${index}`}
                        className="flex h-44 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm font-medium text-gray-500"
                      >
                        Slide image placeholder
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </section>

        <section id="data-breadth" className={sectionClassName('data-breadth')}>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold text-gray-900">What You Can Answer (Breadth of the Data)</h2>
            <p className="mt-4 text-gray-700">
              Our annual trend survey provides comprehensive data across consumer sustainability, health, packaging,
              workplace practices, category behavior, brand perceptions, and messaging, segmented by key demographics
              for targeted insights.
            </p>
            <div className="mt-6">
              <Accordion
                allowMultiple
                defaultOpenIds={[DATA_BREADTH_ITEMS[0].id]}
                items={DATA_BREADTH_ITEMS.map((item) => ({
                  id: item.id,
                  title: item.title,
                  content: (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ),
                }))}
              />
            </div>
            <p className="mt-6 text-gray-700">
              Why This Matters: Whether you’re launching a sustainable product line, redesigning packaging,
              communicating environmental commitments, building workplace programs, or benchmarking your brand’s
              eco-reputation, our data reveals what consumers believe, trust, and purchase.
            </p>
          </div>
        </section>

        <section id="defensible" className={sectionClassName('defensible')}>
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">Act on Facts</h2>
              <p className="mt-4 text-gray-700">
                We are not alone in our belief in the importance of good data. The AMEC, Barcelona Principles 3 report
                states that robust data and solid insights should underpin communications planning, grounded in clear
                goals and supported by both qualitative and quantitative evidence.*
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Stronger briefs</li>
                <li>Faster approvals</li>
                <li>Defensible recommendations</li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">*Source: AMEC, Barcelona Principles 3. (2020)</p>
            </article>

            <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Nationally Representative, Longitudinal Data You Can Defend
              </h2>
              <p className="mt-4 text-gray-700">
                At EcoFocus, we bring 15 years of rigorous syndicated research on US consumers’ sustainability
                attitudes and behaviors. Our extensive study is carefully designed to be representative of the US adult
                population based on key census characteristics and boasts a robust sample of 4,000 respondents and a
                highly reliable margin of error of just 1.55%.
              </p>
            </article>
          </div>
        </section>

        <section id="roi" className={sectionClassName('roi')}>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold text-gray-900">Purpose Generation: Client ROI</h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">Reduce Customer Churn</h3>
                <p className="mt-3 text-sm text-gray-700">
                  Consumers are 4x more likely to purchase from a brand they believe has a strong purpose. EcoFocus
                  data helps you sharpen your message that can build lasting emotional connections. When consumers
                  believe a brand has a strong purpose, they’re 6x more likely to continue supporting it in a
                  challenging moment, helping reduce churn risk.*
                </p>
                <p className="mt-3 text-xs text-gray-500">*Zeno Group, 2020 Strength of Purpose Study</p>
              </article>
              <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">Drive Incremental Growth</h3>
                <p className="mt-3 text-sm text-gray-700">
                  Sustainable values aren’t fringe anymore, they’re mainstream. Our data shows that
                  sustainability-conscious shoppers aren’t just young, coastal elites. They’re parents in suburbia.
                  They’re rural shoppers. And they’re looking for brands to trust.
                </p>
              </article>
              <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">De-Risk The Messaging</h3>
                <p className="mt-3 text-sm text-gray-700">
                  EcoFocus can help companies avoid vague claims that trigger skepticism. We can test what resonates,
                  like “Plastic-Free Packaging” vs. “Certified Carbon Neutral”, so you can communicate with
                  confidence.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="portal" className={sectionClassName('portal')}>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold text-gray-900">Data Now—When You Need It</h2>
            <p className="mt-4 text-gray-700">
              Our Portal’s fast filters and export-ready visuals let strategists and creators work without research
              bottlenecks, while rigorous research data helps teams craft credible sustainability messaging and defend
              recommendations with confidence.
            </p>
            <p className="mt-3 text-gray-700">
              In short: EcoFocus turns sustainability from a fuzzy talking point into a measurable, actionable growth
              strategy your clients can execute immediately.
            </p>
            <div className="mt-6">
              <AgencyVideoPlayer
                src="/video/agency-overview-placeholder.mp4"
                poster="/video/agency-overview-poster.jpg"
                chapters={[...CHAPTERS]}
              />
            </div>
          </div>
        </section>

        <section id="modules" className={sectionClassName('modules')}>
          <div className="mx-auto max-w-5xl rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-gray-900">Key Data Portal Modules</h2>
            <ul className="mt-6 grid gap-3 text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
              <li className="rounded-lg bg-emerald-50 p-3">Demographics</li>
              <li className="rounded-lg bg-emerald-50 p-3">Concerns and Awareness</li>
              <li className="rounded-lg bg-emerald-50 p-3">Shopping Attitudes and Priorities</li>
              <li className="rounded-lg bg-emerald-50 p-3">Brand Expectations and Messaging</li>
              <li className="rounded-lg bg-emerald-50 p-3">Employment</li>
              <li className="rounded-lg bg-emerald-50 p-3">Packaging</li>
              <li className="rounded-lg bg-emerald-50 p-3">Certifications and Labels</li>
              <li className="rounded-lg bg-emerald-50 p-3">EPR (Extended Producer Responsibility)</li>
            </ul>
            <p className="mt-4 text-sm italic text-gray-500">See an expanded version in Appendix</p>
          </div>
        </section>

        <section id="pricing" className={sectionClassName('pricing')}>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold text-gray-900">Seat License Rate Card</h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <article className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Under $2M in annual revenue</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  <li>All dashboard modules</li>
                  <li>Two onboarding sessions</li>
                  <li>Up to two hours of consultations per quarter</li>
                  <li>Includes 2 seat licenses</li>
                </ul>
                <p className="mt-5 text-sm font-semibold text-emerald-800">
                  $2,600 per month OR $29,500 if paid annually
                </p>
              </article>

              <article className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Between $2M & $10M in annual revenue</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  <li>All dashboard modules</li>
                  <li>Two onboarding sessions</li>
                  <li>Up to two hours of consultations per quarter</li>
                  <li>Includes 3 seat licenses</li>
                </ul>
                <p className="mt-5 text-sm font-semibold text-emerald-800">
                  $4,150 per month OR $47,500 if paid annually
                </p>
              </article>

              <article className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Over $10M in annual revenue</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  <li>All dashboard modules</li>
                  <li>Two onboarding sessions</li>
                  <li>Up to two hours of consultations per quarter</li>
                  <li>Includes 5 seat licenses</li>
                </ul>
                <p className="mt-5 text-sm font-semibold text-emerald-800">
                  $6,200 per month OR $71,000 if paid annually
                </p>
              </article>
            </div>
            <p className="mt-4 text-sm text-gray-600">Qualified Not-for-Profit — 20% Discount</p>
          </div>
        </section>

        <section id="guarantee" className={sectionClassName('guarantee')}>
          <div className="mx-auto max-w-6xl rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-white shadow-sm">
            <h2 className="text-3xl font-semibold">The EcoFocus® Portal: Launch Program Guarantee</h2>
            <p className="mt-3 text-emerald-100">
              If you don’t get value from EcoFocus in your first year, we’ll make it right.
            </p>
            <p className="mt-5 text-sm text-emerald-50">
              We’re confident EcoFocus® Portal insights will show up in your work, either in client deliverables or
              internal planning. If your team doesn’t use the Portal or doesn’t find it valuable during your first 12
              months, tell us and we’ll make it right. This is a limited offer as part of the Portal Launch Program.
            </p>
            <p className="mt-5 rounded-lg bg-white/10 p-4 text-sm text-emerald-50">
              Value can include using EcoFocus insights to inform strategy, messaging, audience segmentation, briefs,
              POVs, pitches, recommendations, or renewal planning, whether or not the data is shared directly with a
              client.
            </p>
            <p className="mt-4 text-xs text-emerald-200">Full terms available in Appendix</p>
          </div>
        </section>

        <section id="faq" className={sectionClassName('faq')}>
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-semibold text-gray-900">FAQ</h2>
            <div className="mt-6">
              <Accordion
                items={FAQ_ITEMS.map((item) => ({
                  id: item.id,
                  title: item.title,
                  content: <p className="text-sm text-gray-700">{item.content}</p>,
                }))}
                defaultOpenIds={[FAQ_ITEMS[0].id]}
              />
            </div>
          </div>
        </section>

        <section id="contact" className={sectionClassName('contact')}>
          <div className="mx-auto max-w-6xl rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-3xl font-semibold text-gray-900">Ready to win your next pitch with defensible data?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-gray-700">
              Let’s walk through the Portal, show relevant modules for your category, and map insights to your upcoming
              opportunities.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary-emerald">
                Schedule a Demo
              </Link>
              <Link href="/contact" className="btn-secondary-light">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
