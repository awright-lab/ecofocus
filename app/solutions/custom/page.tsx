// app/solutions/custom/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CustomHero from '@/app/solutions/custom/CustomHero'
import WhyCustom from '@/app/solutions/custom/WhyCustom'
import Approaches from '@/app/solutions/custom/Approaches'
import Deliverables from '@/app/solutions/custom/Deliverables'
import UseCases from '@/app/solutions/custom/UseCases'
import Process from '@/app/solutions/custom/Process'
import FinalCTA from '@/app/solutions/custom/FinalCTA'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Custom Research | EcoFocus Research',
  description:
    'Bespoke sustainability research—quant, qual, and mixed methods—tailored to your category, buyers, and decisions.',
}

export default function CustomResearchPage() {
  return (
    <>
      <Header />
      <main className="bg-neutral-50">
        <CustomHero />
        <WhyCustom />
        <Approaches />
        <Deliverables />
        <UseCases />
        <Process />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
