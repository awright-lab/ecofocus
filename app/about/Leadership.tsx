'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type Person = {
  name: string;
  title: string;
  img: string;
  blurb: string;
  details?: string;
};

export default function Leadership() {
  const reduceMotion = useReducedMotion();

  const people: Person[] = [
    {
      name: 'Jerry Croft',
      title: 'Chief Executive Officer',
      img: '/images/team/jerry.jpg',
      blurb:
        'Guides EcoFocus’ vision and agency partnerships, ensuring insights translate into meaningful campaigns and client growth.',
      details:
        'With a career spanning brand strategy and agency leadership, Jerry brings a pragmatic lens to sustainability—turning research into roadmaps and aligning teams around measurable outcomes.',
    },
    {
      name: 'Michael Croft',
      title: 'VP, Business Development',
      img: '/images/team/michael.jpg',
      blurb:
        'Connects agencies with EcoFocus data, helping them win pitches and deliver strategies rooted in sustainability insights.',
      details:
        'Partners with account and strategy leads to pinpoint where EcoFocus data can move the needle—audience sizing, proof-points, and message frameworks that convert.',
    },
    {
      name: 'Elinor Gaida',
      title: 'VP, Research & Strategy',
      img: '/images/team/elinor.jpg',
      blurb:
        'Leads study design and strategic frameworks, bridging rigorous data with actionable direction for brand teams and agencies.',
      details:
        'Architects our mixed-method designs and decision frameworks; specializes in closing the say–do gap with clear, testable guidance.',
    },
    {
      name: 'Allison Duncan',
      title: 'Director, Research & Insights',
      img: '/images/team/allison.jpg',
      blurb:
        'Transforms data into narratives agencies can use directly in briefs, decks, and campaigns.',
      details:
        'Turns complex data into concise stories—prioritizing what to do next, not just what the chart says.',
    },
    {
      name: 'Arif Wright',
      title: 'Director, Business Intelligence & Design',
      img: '/images/team/arif.jpg',
      blurb:
        'Shapes EcoFocus dashboards and design outputs, making insights accessible, visual, and client-ready.',
      details:
        'Leads dashboards, data viz, and design system—clarity at a glance and depth on demand.',
    },
    {
      name: 'Alex Murrey',
      title: 'Head, Technology & AI',
      img: '/images/team/alex.jpg',
      blurb:
        'Leads technology and AI integration, ensuring agencies can leverage cutting-edge tools for faster, smarter research.',
      details:
        'Builds data/AI pipelines that speed up learning cycles while keeping quality, transparency, and governance front-and-center.',
    },
  ];

  const [flipped, setFlipped] = React.useState<Record<number, boolean>>({});
  const toggle = (i: number) => setFlipped((s) => ({ ...s, [i]: !s[i] }));

  return (
    <section className="relative section-slab-deep" aria-labelledby="leadership">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="leadership"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-center font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Meet the{' '}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Team
          </span>{' '}
          Behind the Work
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-10 max-w-2xl text-center text-sm sm:text-base text-white/85"
        >
          A senior team dedicated to translating sustainability insights into
          agency-ready strategies, with the rigor and clarity to stand up in the
          boardroom.
        </motion.p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p, i) => {
            const isFlipped = !!flipped[i];

            /* Reduced-motion: no 3D, just inline details */
            if (reduceMotion) {
              return (
                <motion.article
                  key={p.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="overflow-hidden rounded-2xl bg-white ring-1 ring-white/15 shadow-[0_14px_44px_-18px_rgba(2,12,27,.45)]"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
                      className="object-cover"
                      priority={i < 3}
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{p.title}</p>
                    <p className="mt-3 text-sm text-gray-700">{p.blurb}</p>
                    <button
                      onClick={() => toggle(i)}
                      className="mt-4 inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      aria-expanded={isFlipped}
                      aria-controls={`details-${i}`}
                    >
                      {isFlipped ? 'Hide details' : 'Read more'}
                    </button>
                    {isFlipped && (
                      <div
                        id={`details-${i}`}
                        className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 ring-1 ring-gray-200"
                      >
                        {p.details ?? p.blurb}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            }

            /* Default: 3D flip with fixed height */
            return (
              <motion.article
                key={p.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group"
              >
                <div className="relative [perspective:1200px]">
                  {/* The outer box enforces a constant height */}
                  <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_14px_44px_-18px_rgba(2,12,27,.45)] ring-1 ring-white/15 bg-white">
                    {/* Fixed height via aspect ratio */}
                    <div className="aspect-[4/5]">
                      <motion.div
                        className="relative h-full w-full [transform-style:preserve-3d]"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: [0.33, 0, 0.23, 1] }}
                      >
                        {/* FRONT FACE */}
                        <div className="absolute inset-0 [backface-visibility:hidden]">
                          <div className="relative h-full w-full">
                            <div className="relative h-1/2 w-full">
                              <Image
                                src={p.img}
                                alt={p.name}
                                fill
                                sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
                                className="object-cover"
                                priority={i < 3}
                              />
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
                            </div>
                            <div className="h-1/2 p-5">
                              <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                              <p className="mt-1 text-sm text-gray-600">{p.title}</p>
                              <p className="mt-3 text-sm text-gray-700 line-clamp-3">{p.blurb}</p>
                              <button
                                onClick={() => toggle(i)}
                                className="mt-4 inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                aria-label={`Read more about ${p.name}`}
                              >
                                Read more
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* BACK FACE */}
                        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                          <div className="flex h-full w-full flex-col rounded-2xl bg-white">
                            <div className="p-5">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-gray-200">
                                  <Image
                                    src={p.img}
                                    alt=""
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                                  <p className="text-sm text-gray-600">{p.title}</p>
                                </div>
                              </div>
                            </div>
                            <div className="mx-5 mb-4 flex-1 overflow-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-200">
                              {p.details ?? p.blurb}
                            </div>
                            <div className="px-5 pb-5">
                              <button
                                onClick={() => toggle(i)}
                                className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-800"
                                aria-label={`Close details for ${p.name}`}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}




