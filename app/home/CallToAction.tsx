'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function CallToAction() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-20">
        {/* subtle floating accents */}
        <div
          className="pointer-events-none absolute -top-20 -left-24 h-56 w-56 rounded-full bg-emerald-100 blur-3xl opacity-30"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-28 h-60 w-60 rounded-full bg-blue-100 blur-3xl opacity-30"
          aria-hidden="true"
        />

        <motion.div
          className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-12"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left: Heading + Paragraph */}
          <motion.div
            className="md:col-span-7 text-center md:text-left"
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            <h2
              id="cta-heading"
              className="mb-4 md:mb-6 font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
            >
              Turn Purpose-Driven Insight Into Campaigns That{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Perform
              </span>
            </h2>
            <p className="mx-auto md:mx-0 max-w-prose text-sm text-gray-600 sm:text-base leading-relaxed">
              We are laser focused on delivering data driven information that
              leads to solutions. In order to do that we need to have a clear
              understanding of what your objectives are and define what success
              looks like to you.
              <br />
              <br />
              We accomplish this with a no cost, no obligation Discovery Call.
              On the discovery call we will ask questions and listen to what
              your needs are. Following that, we will review the various options
              available to you from EcoFocus and align those with what you are
              looking for and what will be most valuable to you that works
              within your budget.
              <br />
              <br />
              From that we will create a scope document with deliverables,
              timeline and cost for your review and approval.
            </p>
          </motion.div>

          {/* Right: Callout Card */}
          <motion.aside
            className="md:col-span-5"
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 p-6 md:p-7">
              <h3 className="text-lg font-semibold text-gray-900">
                What you’ll get
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Clear objectives & success criteria
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Options mapped to your budget & timeline
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Scope doc with deliverables & costs
                </li>
              </ul>

              <Link
                href="/contact"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0 relative"
              >
                <span className="relative z-10">Book a discovery call</span>
              </Link>

              <p className="mt-3 text-center text-xs text-gray-500">
                Avg response &lt; 1 business day · No obligation
              </p>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}







