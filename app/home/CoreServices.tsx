'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type Card = {
  title: string;
  href: string;
  image: { src: string; alt: string };
  bullets: string[];
  footnote?: React.ReactNode;
};

export default function CoreServices() {
  const reduceMotion = useReducedMotion();

  const cards: Card[] = [
    {
      title: 'Syndicated Research',
      href: '/solutions/syndicated',
      image: { src: '/images/solutions-syndicated.png', alt: 'Analyst reviewing sustainability dashboards' },
      bullets: [
        'Annual U.S. study (n=4,000), Census-balanced',
        'Trends since 2010 across attitudes & behaviors',
        'Interactive dashboard with instant crosstabs',
      ],
    },
    {
      title: 'Custom Research',
      href: '/solutions/custom',
      image: { src: '/images/solutions-custom.png', alt: 'Workshop with stakeholder sticky notes' },
      bullets: [
        'B2C & B2B: qual + quant',
        'Questionnaire, sample & analysis',
        'Executive summary & workshop',
      ],
    },
    {
      title: 'Data Infusion',
      href: '/solutions/infusion',
      image: { src: '/images/solutions-infusion.png', alt: 'Data visualization showing customer segments' },
      bullets: [
        'Enrich your data with EcoFocus context',
        'Personas with a sustainability lens',
        'Frictionless BI integration',
      ],
    },
    {
      title: 'Consulting & Enablement',
      href: '/solutions/consulting',
      image: { src: '/images/solutions-consulting.png', alt: 'Team collaboration for strategy activation' },
      bullets: [
        'Strategy activation & change management',
        'Team enablement, training & adoption',
        'Program rollouts / PMO support',
      ],
      footnote: (
        <>
          Delivered with our consulting partner{' '}
          <a href="https://fwdfocus.com/" target="_blank" rel="noreferrer" className="underline">
            ForwardFocus
          </a>.
        </>
      ),
    },
  ];

  return (
    <section className="bg-white" aria-labelledby="solutions-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <header className="mb-8 md:mb-10">
          <h2 id="solutions-heading" className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)]">
            Solutions
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Choose the path that fits your goals—then scale from insights to action.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Media */}
              <div className="relative aspect-[16/9]">
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 92vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>

                {/* ✅ Perfect round markers + more breathing room */}
                <ul role="list" className="mt-3 space-y-2.5 text-sm text-gray-700">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Spacer pushes CTA to bottom */}
                <div className="grow" />

                {/* ✅ Guaranteed gap above the button */}
                <div className="mt-6 md:mt-8">
                  <Link
                    href={c.href}
                    className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white overflow-hidden transition
                               before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                               before:z-0 before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110"
                    aria-label={`Learn more about ${c.title}`}
                  >
                    <span className="relative z-10">Learn More</span>
                    <i className="ri-arrow-right-s-line ml-1 text-base" aria-hidden="true" />
                  </Link>
                </div>

                {/* Footnote keeps height consistent across cards */}
                <div className="mt-3 min-h-[2.5rem] text-xs leading-snug text-gray-500">
                  {c.footnote || null}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

















