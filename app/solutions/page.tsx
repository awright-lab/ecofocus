// app/solutions/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

// Shared site components
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SolutionsPage() {
  const reduceMotion = useReducedMotion();

  const solutions = [
    {
      title: 'Dashboard Access',
      description:
        'Your always-on gateway to 90,000+ sustainability data points. Explore trends, build crosstabs, and export visuals in real time.',
      href: '/dashboard',
      icon: 'ri-dashboard-3-line',
      image: '/images/solutions-dashboard.png',
    },
    {
      title: 'Syndicated Study Buy-In (2025)',
      description:
        'Join the 2025 EcoFocus study of 4,000+ U.S. adults. Add your own proprietary questions and receive dashboard access, crosstabs, and custom reporting.',
      href: '/solutions/syndicated-buy-in',
      icon: 'ri-bar-chart-2-line',
      image: '/images/solutions-syndicated.png',
    },
    {
      title: 'Enhance Your Data',
      description:
        'Blend EcoFocus 2024 data with your own datasets to enrich personas, forecasting, and analytics. Delivered via dashboard overlay or raw data lake integration.',
      href: '/solutions/enhance-your-data',
      icon: 'ri-database-2-line',
      image: '/images/solutions-enhance.png',
    },
    {
      title: 'Custom Research',
      description:
        'Tailored surveys, concept tests, and packaging validation designed around your unique audiences and objectives.',
      href: '/solutions/custom',
      icon: 'ri-flask-line',
      image: '/images/solutions-custom.png',
    },
  ];

  return (
    <>
      <Header />

      <main className="bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center">
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-bold text-[clamp(2rem,6vw,3rem)] leading-tight"
            >
              Our Solutions
            </motion.h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-emerald-50">
              From syndicated studies to custom projects, every path leads to one goal:
              actionable insights delivered through the EcoFocus Dashboard.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((s, i) => (
              <motion.article
                key={s.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm
                           transition hover:border-emerald-300 hover:shadow-md flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/9]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 30vw, 92vw"
                    className="object-cover"
                  />
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col">
                  <div className="flex items-start gap-3">
                    {s.icon && (
                      <i aria-hidden="true" className={`${s.icon} text-2xl text-emerald-600`} />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{s.description}</p>
                  <Link
                    href={s.href}
                    className="mt-auto inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    aria-label={`Learn more about ${s.title}`}
                  >
                    Learn more →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* CTA Strip */}
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Ready to see EcoFocus in action?
            </h2>
            <p className="mt-2 text-gray-600">
              Explore the Dashboard or connect with our team for a discovery call.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
              >
                View Dashboard
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}


