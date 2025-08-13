'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function PartnersBand() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100" aria-labelledby="partners">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="mb-6 text-center">
          <motion.h2
            id="partners"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold leading-tight text-gray-900 text-[clamp(1.4rem,4.8vw,2rem)]"
          >
            Partners in Activation
          </motion.h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-gray-600">
            From research to rollout, we collaborate with specialists to help teams adopt and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">ForwardFocus</h3>
            <p className="mt-2 text-sm text-gray-700">
              Change-management and enablement partner for strategy activation, training, and program rollouts.
            </p>
            <Link
              href="https://fwdfocus.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-600"
            >
              Visit ForwardFocus →
            </Link>
          </div>

          <div className="md:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Get in Touch</h3>
            <p className="mt-2 text-sm text-gray-700">Let’s explore how we can work together.</p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
