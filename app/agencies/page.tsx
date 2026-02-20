import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import StickySectionNav from '@/components/StickySectionNav';
import Accordion from '@/components/Accordion';
import { FadeUp } from '@/components/ui/Reveal';
import { MeasureCard } from '../brands/MeasureCard';
import WhyNowWaves from './WhyNowWaves';

export const metadata: Metadata = {
  title: {
    absolute: 'EcoFocus for Agencies | Win RFPs + De-Risk Sustainability Messaging',
  },
  description:
    'EcoFocus gives agencies nationally representative sustainability insights to win RFPs, de-risk claims, and deliver defensible strategy, fast.',
  alternates: {
    canonical: '/agencies',
  },
};

const SECTION_ITEMS = [
  { id: 'agency-advantage', label: 'Agency Advantage' },
  { id: 'defensible', label: 'Defensible Data' },
  { id: 'purpose-generation', label: 'Purpose Market' },
  { id: 'why-now', label: 'Why Now' },
  { id: 'winning', label: 'Winning' },
  { id: 'roi', label: 'Client ROI' },
  { id: 'data-breadth', label: 'Data Breadth' },
  { id: 'instant-access', label: 'Instant Access' },
  { id: 'modules', label: 'Modules' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'guarantee', label: 'Guarantee' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;

const DATA_BREADTH_ITEMS = [
  {
    id: 'breadth-1',
    title: 'Environmental and Health Consciousness',
    bullets: [
      'Environmental, health, and economic decision-making factors (Q3)',
      'Climate change attitudes (Q9B2, QInformed) and chemical anxieties: PFAS, microplastics, BPA, phthalates, lead, formaldehyde, heavy metals (Q9A)',
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
      'Trust in sources, including scientists, government, organizations, corporations, and influencers (QTrust)',
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

const AGENCY_ADVANTAGE_CARDS = [
  {
    title: 'Win More Competitive RFPs',
    kicker: 'Pitch engine for strategy teams',
    description:
      'Bring category-specific sustainability evidence directly into your pitch narrative to show exactly how values correlate with behavior in your client’s market.',
    bullets: [
      'Translate cultural signals into commercial opportunity framing',
      'Differentiate your point of view with national consumer evidence',
      'Strengthen procurement confidence with defensible strategy logic',
    ],
  },
  {
    title: 'De-Risk Client Messaging',
    kicker: 'Message clarity before campaigns launch',
    description:
      'Use EcoFocus to prioritize claims and themes most likely to resonate, helping teams avoid vague language that triggers skepticism or delays approvals.',
    bullets: [
      'Pressure-test claim directions before creative finalization',
      'Align messaging with audience trust drivers and proof needs',
      'Reduce revision cycles caused by subjective stakeholder debate',
    ],
  },
  {
    title: 'Scale Always-On Thought Leadership',
    kicker: 'Delivery engine for ongoing work',
    description:
      'Keep PR, social, and comms content grounded in current data so teams can publish credible points of view continuously, not just during campaign peaks.',
    bullets: [
      'Create recurring POV content from fresh consumer trend signals',
      'Support earned media and social narratives with data citations',
      'Equip account teams with reusable insight-led story angles',
    ],
  },
] as const;

const DEFENSIBLE_DATA_CARDS: Array<{
  title: string;
  kicker: string;
  description: string;
  bullets: string[];
  footnote?: string;
}> = [
  {
    title: 'Act on Facts',
    kicker: 'Third-party principles reinforce this approach',
    description:
      'We are not alone in our belief in the importance of good data. The AMEC, Barcelona Principles 3 report states that robust data and solid insights should underpin communications planning, grounded in clear goals and supported by both qualitative and quantitative evidence.*',
    bullets: ['Stronger briefs', 'Faster approvals', 'Defensible recommendations'],
    footnote: '*Source: AMEC, Barcelona Principles 3. (2020)',
  },
  {
    title: 'Nationally Representative, Longitudinal Data You Can Defend',
    kicker: 'Built for confidence in strategic recommendations',
    description:
      'At EcoFocus, we bring 16 years of rigorous syndicated research on US consumers’ sustainability attitudes and behaviors. Our extensive study is carefully designed to be representative of the US adult population based on key census characteristics and boasts a robust sample of 4,000 respondents and a highly reliable margin of error of just 1.55%.',
    bullets: ['16 years of longitudinal trend data', '4,000-respondent US sample', 'Margin of error of 1.55%'],
  },
] as const;

function sectionClassName() {
  return 'scroll-mt-28 container mx-auto px-6 py-14';
}

export default function AgenciesPage() {
  return (
    <>
      <Header />

      <main id="main" className="min-h-screen bg-white text-gray-900">
        <div id="overview" className="scroll-mt-28">
          <Hero
            variant="report"
            size="normal"
            badge="EcoFocus for Agencies"
            headline={
              <>
                <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                  WIN
                </span>{' '}
                new business and{' '}
                <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                  GROW
                </span>{' '}
                existing business with actionable purpose driven insights
              </>
            }
            subhead="EcoFocus becomes both a pitch engine and a delivery engine for advertising, marketing, PR and comms teams, giving you expert-supported access to nationally representative insights on the purpose market and how sustainability values translate into real purchasing behavior."
            videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
            posterSrc="/images/hero/leaf-neural.jpg"
            overlay="dense"
          />
        </div>

        <StickySectionNav items={[...SECTION_ITEMS]} mobileLabel="Jump to section" />

        <section id="agency-advantage" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-black/60">Agency Advantage</span>
            </div>

            <h2 className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight">
              Turn EcoFocus Into Your{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Agency Advantage
              </span>
            </h2>

            <p className="mt-4 max-w-4xl text-base md:text-lg text-slate-600">
              For advertising, marketing, PR and comms firms, EcoFocus becomes both a pitch engine and a delivery
              engine. Use our data to win opportunities, reduce risk, and keep high-credibility strategy in market.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {AGENCY_ADVANTAGE_CARDS.map((card, i) => (
                <div
                  key={card.title}
                  className="relative rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)] p-[1px]"
                >
                  <article className="flex h-full flex-col rounded-[1rem] bg-white ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)] transition hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)]">
                    <div className="px-6 pt-6 pb-4">
                      <div className="mb-2 flex items-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-[#ef9601] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="text-[22px] font-semibold leading-snug tracking-tight text-slate-900">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm leading-snug text-emerald-600">{card.kicker}</p>
                    </div>

                    <div className="px-6 pb-2">
                      <p className="text-[15px] leading-relaxed text-slate-700">{card.description}</p>
                    </div>

                    <div className="px-6 pt-2 pb-6">
                      <ul className="grid gap-1.5">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="relative pl-5 text-sm text-slate-600">
                            <span
                              aria-hidden
                              className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        <section id="defensible" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-black/60">Defensible Data</span>
            </div>
            <h2 className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight">
              Nationally Representative Data You Can{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Defend
              </span>
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {DEFENSIBLE_DATA_CARDS.map((card, i) => (
                <div
                  key={card.title}
                  className="relative rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)] p-[1px]"
                >
                  <article className="flex h-full flex-col rounded-[1rem] bg-white ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)] transition hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)]">
                    <div className="px-6 pt-6 pb-4">
                      <div className="mb-2 flex items-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-[#ef9601] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="text-[22px] font-semibold leading-snug tracking-tight text-slate-900">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm leading-snug text-emerald-600">{card.kicker}</p>
                    </div>

                    <div className="px-6 pb-2">
                      <p className="text-[15px] leading-relaxed text-slate-700">{card.description}</p>
                    </div>

                    <div className="px-6 pt-2 pb-4">
                      <ul className="grid gap-1.5">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="relative pl-5 text-sm text-slate-600">
                            <span
                              aria-hidden
                              className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {card.footnote ? (
                      <p className="px-6 pb-6 text-xs text-slate-500">{card.footnote}</p>
                    ) : null}
                  </article>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        <section id="purpose-generation" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-black/60">Purpose Generation</span>
            </div>
            <h2 className="max-w-5xl text-[clamp(1.6rem,5.2vw,2.4rem)] font-bold leading-tight text-slate-900 md:text-[clamp(2rem,3.6vw,2.75rem)]">
              Forecast: Millennials and Gen Z will make up{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                65%
              </span>{' '}
              of purchasing power by{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                2030
              </span>
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-12">
              <div className="relative z-0 md:row-start-1 md:col-start-1 md:col-span-7">
                <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
                  <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-lg md:h-[24rem]">
                    <Image
                      src="/images/purpose-driven.png"
                      alt="Purpose-driven generation visual"
                      fill
                      className="object-cover"
                      style={{ objectPosition: '78% center', transform: 'scaleX(-1) scale(1.24)' }}
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-20 mt-5 md:row-start-1 md:col-start-7 md:col-span-6 md:mt-44 lg:mt-48">
                <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 md:p-7">
                  <ul className="grid gap-2">
                    <li className="relative pl-5 text-sm text-slate-600">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      <span>The Purpose-Driven Generation is reshaping the consumer landscape.</span>
                    </li>
                    <li className="relative pl-5 text-sm text-slate-600">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      <span>
                        These are individuals, largely Gen Z, Millennials, and increasingly younger Gen Xers, whose
                        values directly influence how they shop,
                      </span>
                    </li>
                    <li className="relative pl-5 text-sm text-slate-600">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      <span>What they advocate for, and which brands they trust.</span>
                    </li>
                    <li className="relative pl-5 text-sm text-slate-600">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      <span>They care about ethical sourcing, environmental impact, and corporate transparency.</span>
                    </li>
                  </ul>
                  <p className="mt-6 text-gray-700">
                    They prioritize sustainability, health, and ethics, not just in what they buy, but in who they buy
                    from. Purpose isn’t just a value proposition. It’s the new margin-friendly differentiation and growth
                    driver.
                  </p>
                  <p className="mt-4 text-sm text-gray-500">*Source: NielsenIQ/tPX White Paper</p>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        <section id="why-now" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span className="text-black/60">So Why Now?</span>
                </span>
                <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight text-slate-900">
                  2030 Is Closer Than It Looks.
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                    Be Early or Be Late
                  </span>
                </h2>
                <WhyNowWaves />
              </div>
              <div className="md:col-span-7">
                <div className="relative md:min-h-[26rem]">
                  <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
                    <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-lg md:h-[26rem]">
                      <Image
                        src="/images/agencies/why-now-bg.png"
                        alt="Time and market transition visual"
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 55vw, 100vw"
                      />
                    </div>
                  </div>

                  <div className="mt-6 w-[92%] md:absolute md:-left-10 md:bottom-0 md:mt-0 md:w-[70%] md:translate-y-1/4">
                    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 md:p-8">
                      <p className="text-base italic leading-relaxed text-slate-700">
                        2030 is right around the corner. The time for companies to prepare for this huge shift in
                        consumer purchasing power is NOW.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        <section id="winning" className="scroll-mt-28 bg-slate-50/80">
          <FadeUp className="mx-auto max-w-7xl px-6 py-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-black/60">Winning</span>
            </div>
            <h2 className="max-w-5xl text-[clamp(1.8rem,4.5vw,2.6rem)] font-bold leading-tight text-slate-900">
              Winning With{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Defensible Insight
              </span>
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-12">
              <div className="relative z-0 md:row-start-1 md:col-start-1 md:col-span-7">
                <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
                  <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-lg md:h-[24rem]">
                    <Image
                      src="/images/winning.png"
                      alt="Agency winning insights visual"
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 55vw, 100vw"
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-20 mt-5 md:row-start-1 md:col-start-7 md:col-span-6 md:mt-44 lg:mt-48">
                <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 md:p-7">
                  <p className="text-slate-700">
                    Agencies win when they can turn cultural signals into commercial outcomes, and that’s exactly what
                    EcoFocus delivers. Our Portal gives you interactive, expert-supported access to nationally
                    representative insights on the purpose-driven generation (Gen Z & Millennials) and how they differ
                    from older consumers.
                  </p>
                  <ul className="mt-5 grid gap-2">
                    <li className="relative pl-5 text-sm text-slate-600">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      <span>Which sustainability certifications and messages resonate</span>
                    </li>
                    <li className="relative pl-5 text-sm text-slate-600">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      <span>Which fail to drive behavior</span>
                    </li>
                    <li className="relative pl-5 text-sm text-slate-600">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      <span>What builds trust in environmental claims</span>
                    </li>
                    <li className="relative pl-5 text-sm text-slate-600">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500"
                      />
                      <span>How environmental values correlate with purchasing patterns across categories</span>
                    </li>
                  </ul>
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-700">
                    For example: 80% of respondents say they are aware of the USDA Organic certification, but only 41%
                    are aware of the USDA Bio-based Product seal.
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        <section id="roi" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-black/60">How Clients Win</span>
            </div>
            <h2 className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight">
              Purpose Generation:{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                How Clients Win
              </span>
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <MeasureCard
                tone="teal"
                title="Reduce Customer Churn"
                desc="Consumers are 4x more likely to purchase from a brand they believe has a strong purpose. When consumers believe a brand has a strong purpose, they’re 6x more likely to continue supporting it in a challenging moment, helping reduce churn risk.*"
                icon="checklist"
              />
              <MeasureCard
                tone="slate"
                title="Drive Incremental Growth"
                desc="Sustainable values aren’t fringe anymore. They’re mainstream. Our data shows sustainability-conscious shoppers include parents in suburbia and rural shoppers who are actively looking for brands they can trust."
                icon="gauge"
              />
              <MeasureCard
                tone="amber"
                title="De-Risk The Messaging"
                desc="EcoFocus helps companies avoid vague claims that trigger skepticism. Test what resonates, like 'Plastic-Free Packaging' vs. 'Certified Carbon Neutral', and communicate with confidence."
                icon="dots"
              />
            </div>
            <p className="mt-4 text-xs text-slate-500">*Zeno Group, 2020 Strength of Purpose Study</p>
          </FadeUp>
        </section>

        <section id="data-breadth" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/30 p-6 shadow-sm md:p-8">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                    <span className="text-black/60">Data Breadth</span>
                  </div>
                  <h2 className="mt-4 text-[clamp(1.6rem,4vw,2.2rem)] font-bold leading-tight text-slate-900">
                    What You Can Answer{' '}
                    <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                      With Confidence
                    </span>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700">
                    Our annual trend survey provides comprehensive data across consumer sustainability, health,
                    packaging, workplace practices, category behavior, brand perceptions, and messaging segmented by
                    key demographics for targeted insights.
                  </p>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-emerald-200/70 bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Coverage</p>
                      <p className="mt-1 text-sm text-slate-700">8 research domains from consciousness to segmentation.</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200/70 bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Activation</p>
                      <p className="mt-1 text-sm text-slate-700">Built for strategy, messaging, innovation, and planning.</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <Accordion
                    tone="solidGreen"
                    allowMultiple
                    defaultOpenIds={[DATA_BREADTH_ITEMS[0].id]}
                    items={DATA_BREADTH_ITEMS.map((item) => ({
                      id: item.id,
                      title: item.title,
                      content: (
                        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                          {item.bullets.map((bullet) => (
                            <li key={bullet}>
                              {bullet
                                .replace(/\s*\((?=[^)]*\d)[^)]+\)/g, '')
                                .replace(/\s{2,}/g, ' ')
                                .trim()}
                            </li>
                          ))}
                        </ul>
                      ),
                    }))}
                  />
                </div>
              </div>
            </div>
            <p className="mt-6 text-gray-700">
              Why This Matters: Whether you’re launching a sustainable product line, redesigning packaging,
              communicating environmental commitments, building workplace programs, or benchmarking your brand’s
              eco-reputation, our data reveals what consumers believe, trust, and purchase.
            </p>
          </FadeUp>
        </section>

        <section id="instant-access" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 p-6 shadow-sm md:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-black/60">Instant Access</span>
              </div>

              <h2 className="text-[clamp(1.8rem,4.2vw,2.7rem)] font-bold leading-tight text-slate-900">
                Instant Access:{' '}
                <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                  Critical Data at Your Fingertips
                </span>
              </h2>
              <p className="mt-4 max-w-5xl text-base leading-relaxed text-slate-700 md:text-lg">
                Our syndicated data is available to you with an annual license fee for you to access 24/7/365 via our
                Interactive Dashboard.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_-10px_rgba(0,0,0,0.12)]">
                  <div className="relative h-64 w-full bg-slate-100 sm:h-72">
                    <Image
                      src="/images/laptop6.png"
                      alt="Interactive dashboard access view"
                      fill
                      className="object-contain bg-slate-50"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-slate-900">Interactive Dashboard: Crosstab Functionality</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      Crosstabs and filters let you tailor proof to each client audience in minutes.
                    </p>
                  </div>
                </article>

                <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_-10px_rgba(0,0,0,0.12)]">
                  <div className="relative h-64 w-full bg-slate-100 sm:h-72">
                    <Image
                      src="/images/laptop5.png"
                      alt="Export-ready charting and filtering workflows"
                      fill
                      className="object-contain bg-slate-50"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-slate-900">Built for Fast Team Activation</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      Move from insight to recommendation quickly with export-ready visuals, reusable cuts, and proof
                      that adapts to category, audience, and pitch context.
                    </p>
                  </div>
                </article>
              </div>

              <div className="mt-7 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm md:p-6">
                <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                  Our Portal&apos;s fast filters and export-ready visuals let strategists and creators work without
                  research bottlenecks, while rigorous research data help teams craft credible sustainability messaging
                  and defend recommendations with confidence.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                  In short: EcoFocus turns sustainability from a fuzzy talking point into a measurable, actionable
                  growth strategy your clients can execute immediately.
                </p>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Portal section temporarily hidden until final video is ready. */}

        <section id="modules" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-black/60">Portal Modules</span>
            </div>
            <h2 className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight">
              Key Data Portal{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Modules
              </span>
            </h2>
            <p className="mt-4 max-w-4xl text-base md:text-lg text-slate-600">
              Built for strategists, planners, creatives, and client leads who need defensible answers quickly across
              the full sustainability decision journey.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Demographics', 'Audience baselines'],
                ['Concerns and Awareness', 'Issue prioritization'],
                ['Shopping Attitudes and Priorities', 'Behavior intent signals'],
                ['Brand Expectations and Messaging', 'Claim/message fit'],
                ['Employment', 'Workplace lens'],
                ['Packaging', 'Material + format insights'],
                ['Certifications and Labels', 'Seal recognition + trust'],
                ['EPR (Extended Producer Responsibility)', 'Policy + purchase impact'],
              ].map(([title, meta], i) => (
                <div
                  key={title}
                  className="relative rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)] p-[1px]"
                >
                  <article className="h-full rounded-[1rem] bg-white p-4 ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.08)] transition hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.12)]">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-[#ef9601] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">{meta}</span>
                    </div>
                    <h3 className="text-[16px] font-semibold leading-snug text-slate-900">{title}</h3>
                  </article>
                </div>
              ))}
            </div>

          </FadeUp>
        </section>

        <section id="pricing" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-black/60">Pricing</span>
            </div>
            <h2 className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight">
              Seat License{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Rate Card
              </span>
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <article className="relative overflow-hidden rounded-xl px-7 py-8 text-center text-white ring-1 ring-teal-800/20 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.45)]">
                <div className="absolute inset-0 bg-[linear-gradient(155deg,#5b8c86_0%,#4d7973_45%,#426b66_100%)]" />
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.35),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.2),transparent_42%)]" />
                <div className="relative flex min-h-[31rem] flex-col">
                  <h3 className="text-[2rem] font-semibold leading-tight">Under $2M in annual revenue</h3>
                  <ul className="mt-8 space-y-3 text-[1.15rem] leading-[1.4] text-white/95">
                    <li>All dashboard modules</li>
                    <li>Two onboarding sessions</li>
                    <li>Up to two hours of consultations per quarter</li>
                    <li>Includes 2 seat licenses</li>
                  </ul>
                  <div className="mt-auto pt-7">
                    <div className="mx-auto mb-4 h-px w-full max-w-[12.5rem] bg-white/35" />
                    <p className="text-[2.25rem] font-extrabold">$2,600</p>
                    <p className="text-[1.15rem] leading-tight text-white/95">Per Month</p>
                    <p className="text-[1.1rem] leading-tight text-white/90">OR</p>
                    <p className="text-[2.25rem] font-extrabold">$29,500</p>
                    <p className="text-[1.15rem] leading-tight text-white/95">If Paid Annually</p>
                  </div>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-xl px-7 py-8 text-center text-slate-900 ring-1 ring-stone-200 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.28)]">
                <div className="absolute inset-0 bg-[linear-gradient(155deg,#e7e1d5_0%,#e3dccf_55%,#ddd6ca_100%)]" />
                <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.55),transparent_38%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.35),transparent_44%)]" />
                <div className="relative flex min-h-[31rem] flex-col">
                  <h3 className="text-[2rem] font-semibold leading-tight">Between $2M & $10M in annual revenue</h3>
                  <ul className="mt-8 space-y-3 text-[1.15rem] leading-[1.4] text-slate-900/95">
                    <li>All dashboard modules</li>
                    <li>Two onboarding sessions</li>
                    <li>Up to two hours of consultations per quarter</li>
                    <li>Includes 3 seat licenses</li>
                  </ul>
                  <div className="mt-auto pt-7">
                    <div className="mx-auto mb-4 h-px w-full max-w-[12.5rem] bg-slate-400/35" />
                    <p className="text-[2.25rem] font-extrabold">$4,150</p>
                    <p className="text-[1.15rem] leading-tight">Per Month</p>
                    <p className="text-[1.1rem] leading-tight text-slate-700">OR</p>
                    <p className="text-[2.25rem] font-extrabold">$47,500</p>
                    <p className="text-[1.15rem] leading-tight">If Paid Annually</p>
                  </div>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-xl px-7 py-8 text-center text-slate-900 ring-1 ring-slate-200 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.3)]">
                <div className="absolute inset-0 bg-[linear-gradient(155deg,#e4e8ee_0%,#dde2ea_52%,#d7dde6_100%)]" />
                <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.55),transparent_38%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.35),transparent_44%)]" />
                <div className="relative flex min-h-[31rem] flex-col">
                  <h3 className="text-[2rem] font-semibold leading-tight">Over $10M in annual revenue</h3>
                  <ul className="mt-8 space-y-3 text-[1.15rem] leading-[1.4] text-slate-900/95">
                    <li>All dashboard modules</li>
                    <li>Two onboarding sessions</li>
                    <li>Up to two hours of consultations per quarter</li>
                    <li>Includes 5 seat licenses</li>
                  </ul>
                  <div className="mt-auto pt-7">
                    <div className="mx-auto mb-4 h-px w-full max-w-[12.5rem] bg-slate-400/35" />
                    <p className="text-[2.25rem] font-extrabold">$6,200</p>
                    <p className="text-[1.15rem] leading-tight">Per Month</p>
                    <p className="text-[1.1rem] leading-tight text-slate-700">OR</p>
                    <p className="text-[2.25rem] font-extrabold">$71,000</p>
                    <p className="text-[1.15rem] leading-tight">If Paid Annually</p>
                  </div>
                </div>
              </article>
            </div>
            <p className="mt-4 text-sm text-slate-600">Qualified Not-for-Profit: 20% Discount</p>
          </FadeUp>
        </section>

        <section id="guarantee" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span className="text-black/60">Guarantee</span>
                </span>
                <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight text-slate-900">
                  The EcoFocus® Portal:
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                    Launch Program Guarantee
                  </span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  If you don’t get value from EcoFocus in your first year, we’ll make it right.
                </p>
              </div>

              <div className="md:col-span-7">
                <div className="relative md:min-h-[26rem]">
                  <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
                    <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-lg md:h-[26rem]">
                      <Image
                        src="/images/guarantee2.png"
                        alt="Launch program guarantee visual"
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'center 62%' }}
                        sizes="(min-width: 768px) 55vw, 100vw"
                      />
                    </div>
                  </div>

                  <div className="mt-6 w-[92%] md:absolute md:-left-10 md:bottom-0 md:mt-0 md:w-[78%] md:translate-y-1/4">
                    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 md:p-8">
                      <p className="text-sm leading-relaxed text-slate-700">
                        We’re confident EcoFocus® Portal insights will show up in your work, either in client
                        deliverables or internal planning. If your team doesn’t use the Portal or doesn’t find it
                        valuable during your first 12 months, tell us and we’ll make it right. This is a limited offer
                        as part of the Portal Launch Program.
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-slate-700">
                        Value can include using EcoFocus insights to inform strategy, messaging, audience segmentation,
                        briefs, POVs, pitches, recommendations, or renewal planning, whether or not the data is shared
                        directly with a client.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        <section id="faq" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-black/60">FAQ</span>
            </div>
            <h2 className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Questions
              </span>
            </h2>
            <p className="mt-4 max-w-3xl text-base text-slate-600">
              Quick answers for agency teams evaluating seat licenses, support, and how to apply EcoFocus data in live
              pitch and client workflows.
            </p>
            <div className="mt-7">
              <Accordion
                items={FAQ_ITEMS.map((item) => ({
                  id: item.id,
                  title: item.title,
                  content: <p className="text-sm text-gray-700">{item.content}</p>,
                }))}
                defaultOpenIds={[FAQ_ITEMS[0].id]}
                tone="modules"
              />
            </div>
          </FadeUp>
        </section>

        <section id="contact" className={sectionClassName()}>
          <FadeUp className="mx-auto max-w-7xl">
            <div className="px-2 py-2 md:py-4">
              <div className="relative grid grid-cols-1 items-start gap-8 md:grid-cols-12">
                <div className="md:col-span-7 text-center md:text-left">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="text-black/60">Contact</span>
                  </div>
                  <h2 className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight">
                    Ready to win your next pitch with{' '}
                    <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                      defensible data?
                    </span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-prose text-sm leading-relaxed text-slate-600 md:mx-0 sm:text-base">
                    Let’s walk through the Portal, show relevant modules for your category, and map insights to your
                    upcoming opportunities.
                  </p>
                </div>

                <aside className="md:col-span-5 md:mt-8 lg:mt-10">
                  <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200 md:p-7">
                    <h3 className="text-lg font-semibold text-gray-900">Book your walkthrough</h3>
                    <ul className="mt-4 space-y-2 text-sm text-gray-700">
                      <li className="relative pl-5">
                        <span aria-hidden className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500" />
                        Review the most relevant modules for your team
                      </li>
                      <li className="relative pl-5">
                        <span aria-hidden className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500" />
                        Map insights to active pitches and client priorities
                      </li>
                      <li className="relative pl-5">
                        <span aria-hidden className="absolute left-0 top-2 inline-block size-1.5 rounded-full bg-emerald-500" />
                        Clarify seat licensing and onboarding options
                      </li>
                    </ul>
                    <Link
                      href="/contact"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-700"
                    >
                      Book a discovery call
                    </Link>
                    <p className="mt-3 text-center text-xs text-gray-500">Avg response &lt; 1 business day · No obligation</p>
                  </div>
                </aside>
              </div>
            </div>
          </FadeUp>
        </section>
      </main>

      <Footer />
    </>
  );
}
