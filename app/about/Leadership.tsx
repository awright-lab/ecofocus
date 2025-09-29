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
  focal?: string; // '50% 40%' etc.
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
        "Jerry Croft offers more than 20 years of media executive experience. His tenure at Metropolis honed his digital transformation skills, particularly towards sustainability. Jerry's leadership in organizing eco-centric events highlights his commitment to a sustainable future. His acumen in research-driven strategy led to EcoFocus's acquisition, aiming to enhance sustainability practices with consumer insights. Jerry also merges his professional expertise with personal passions, developing a religious content streaming platform with his wife, Jennifer.",
      focal: '50% 35%',
    },
    {
      name: 'Michael Croft',
      title: 'VP, Business Development',
      img: '/images/team/michael.jpg',
      blurb:
        'Connects agencies with EcoFocus data, helping them win pitches and deliver strategies rooted in sustainability insights.',
      details:
        "Michael Croft's psychology background and sales experience make him invaluable for EcoFocus' consumer sustainability research. His work at SANDOW Design Group in New York, where he collaborated with firms passionate about sustainability, gives him deep insights into eco-friendly practices in architecture and design industries. Michael's understanding of consumer behavior enriches EcoFocus' efforts in exploring sustainable choices.",
      focal: '50% 42%',
    },
    {
      name: 'Elinor Gaida',
      title: 'VP, Research & Strategy',
      img: '/images/team/elinor.jpg',
      blurb:
        'Leads study design and strategic frameworks, bridging rigorous data with actionable direction for brand teams and agencies.',
      details:
        "Elinor Gaida brings 20 years of expertise in guiding companies through critical business and sustainability questions. Specializing in both qualitative and quantitative methodologies, she has provided actionable insights across various sectors including retail, telecommunications, and technology. Elinor's passion for the outdoors fuels her commitment to sustainability, driving her to explore eco-friendly consumer choices and brand solutions. At EcoFocus Research, she's dedicated to understanding consumer attitudes and aiding brands in their journey towards sustainability leadership.",
      focal: '50% 36%',
    },
    {
      name: 'Allison Duncan',
      title: 'Director, Research & Insights',
      img: '/images/team/allison.jpg',
      blurb:
        'Transforms data into narratives agencies can use directly in briefs, decks, and campaigns.',
      details:
        "Allison Duncan's diverse background in media and marketing research, from Beta Research to Erdos & Morgan and Ipsos, provides her with a unique perspective on B-to-B research initiatives. Her experience on both client and vendor sides, coupled with comprehensive project management skills, makes her an asset in various sectors like CPG and Pharma. Outside of work, Allison enjoys baseball, cooking, reading, and quality time with her loved ones.",
      focal: '50% 45%',
    },
    {
      name: 'Arif Wright',
      title: 'Director, Business Intelligence & Design',
      img: '/images/team/arif.jpg',
      blurb:
        'Shapes EcoFocus dashboards and design outputs, making insights accessible, visual, and client-ready.',
      details:
        "Arif Wright is a dynamic professional with a unique blend of technology and creative graphic design skills. A Web Development and Computer Engineering graduate, he has excelled in roles such as a Data Market Analyst at AMI Corp, where he showcased his analytical and strategic talents. Passionate about sustainable agriculture, particularly hydroponic farming, Arif's environmental advocacy complements his professional pursuits. An avid hiker, his adventurous spirit mirrors his dynamic approach to technology and creativity. Arif is recognized as a versatile, committed professional in his field.",
      focal: '50% 38%',
    },
    {
      name: 'Alex Murrey',
      title: 'Head, Technology & AI',
      img: '/images/team/alex.jpg',
      blurb:
        'Leads technology and AI integration, ensuring agencies can leverage cutting-edge tools for faster, smarter research.',
      details:
        "Alex Murrey is a seasoned technology leader with over seven years of experience in product management, strategic leadership, and research & development. Having worked with companies like Twilio, Launch Consulting, and TangoTeams, Alex has a proven track record in driving product strategy, fostering cross-functional collaborations, and leading high-stakes projects in dynamic environments. With expertise in areas such as AI leadership, cloud transformation, and user experience, Alex has successfully led teams to innovate and deliver customer-centric solutions.",
      focal: '50% 40%',
    },
  ];

  const [flipped, setFlipped] = React.useState<Record<number, boolean>>({});
  const toggle = (i: number) => setFlipped((s) => ({ ...s, [i]: !s[i] }));
  const defaultFocal = '50% 35%';

  // Small helper: reusable clamped text style (works even if Tailwind line-clamp isn't enabled)
  const clamp3: React.CSSProperties = {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

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

            // Shared "front content" (name/title/blurb + footer button)
            const FrontContent = (
              <div className="h-[32%] p-5 flex flex-col">
                <div className="min-h-0">
                  <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{p.title}</p>
                  <p className="mt-3 text-sm text-gray-700" style={clamp3}>
                    {p.blurb}
                  </p>
                </div>
                {/* Dedicated footer bar with top border; button never overlaps text */}
                <div className="mt-auto pt-3 border-t border-gray-200">
                  <button
                    onClick={() => toggle(i)}
                    className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    aria-label={`Read more about ${p.name}`}
                  >
                    Read more
                  </button>
                </div>
              </div>
            );

            /* Reduced motion: no 3D flip */
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
                    <div className="relative h-[68%] w-full">
                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
                        className="object-cover"
                        style={{ objectPosition: p.focal ?? defaultFocal }}
                        priority={i < 3}
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>
                    {FrontContent}
                    {isFlipped && (
                      <div className="mx-5 mb-5 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 ring-1 ring-gray-200">
                        {p.details ?? p.blurb}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            }

            // 3D flip version
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
                  <div className="relative w-full overflow-hidden rounded-2xl bg-white ring-1 ring-white/15 shadow-[0_14px_44px_-18px_rgba(2,12,27,.45)]">
                    <div className="aspect-[4/5]">
                      <motion.div
                        className="relative h-full w-full [transform-style:preserve-3d]"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: [0.33, 0, 0.23, 1] }}
                      >
                        {/* FRONT */}
                        <div className="absolute inset-0 [backface-visibility:hidden]">
                          <div className="relative h-full w-full">
                            <div className="relative h-[68%] w-full">
                              <Image
                                src={p.img}
                                alt={p.name}
                                fill
                                sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
                                className="object-cover"
                                style={{ objectPosition: p.focal ?? defaultFocal }}
                                priority={i < 3}
                              />
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
                            </div>
                            {FrontContent}
                          </div>
                        </div>

                        {/* BACK */}
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
                                    style={{ objectPosition: p.focal ?? defaultFocal }}
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









