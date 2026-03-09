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
  focal?: string; // e.g. '50% 40%'
  zoom?: number;
};

export default function Leadership() {
  const reduceMotion = useReducedMotion();

  const people: Person[] = [
    {
      name: 'Jerry Croft',
      title: 'Chief Executive Officer',
      img: '/images/team/jerry.jpg',
      blurb:
        'Guides EcoFocus vision and agency partnerships, ensuring insights translate into meaningful campaigns and client growth.',
      details:
        "Jerry Croft offers more than 20 years of media executive experience including having been a minority owner of Inside Sports Magazine, President of multiple divisions of Publications International, a large book and magazine publisher and Chief Strategy Officer at Metropolis Media. His tenure at Metropolis included pivoting Metropolis to focus on sustainability making Metropolis the clear leader in the field. Jerry's leadership in organizing eco-centric events highlights his commitment to a sustainable future. His acumen in research-driven strategy led to EcoFocus's acquisition, aiming to enhance sustainability practices with consumer insights.",
      focal: '50% 35%',
    },
    {
      name: 'Michael Croft',
      title: 'VP, Business Development',
      img: '/images/team/michael.jpg',
      blurb:
        'Connects agencies with EcoFocus data, helping them win pitches and deliver strategies rooted in sustainability insights.',
      details:
        "Michael Croft was most recently a Business Development manager at SANDOW Media in New York City where he collaborated with advertising agencies and firms passionate about sustainability giving him deep insights into eco-friendly practices in architecture and design industries. Michael's college background includes the study of psychology giving him an understanding of consumer behavior that enriches EcoFocus' efforts in exploring sustainable choices.",
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
        "Allison Duncan's diverse background in media and marketing research, from Erdos & Morgan, Ipsos and Beta Research, provides her with years of experience working with large companies on major research projects in both consumer facing and B2B. Her experience on both client and vendor sides, coupled with comprehensive project management skills, makes her an asset in various sectors like CPG and Pharma. Outside of work, Allison enjoys baseball, cooking, reading, and quality time with her loved ones.",
      focal: '50% 45%',
    },
    {
      name: 'Craig Miller',
      title: 'Agency Specialist',
      img: '/images/team/Craig.jpeg',
      blurb:
        'Brings agency and client-side media expertise grounded in purpose-driven consumer strategy.',
      details:
        'Craig Miller is an experienced media executive that understands the needs of both agency and client and the importance of creating messaging based on solid data. He was formerly the head of Western sales for MRI-Simmons and SRDS and by virtue of his years in the business knows how to navigate complex media industry shifts that have led him to understanding the importance of the Purpose Driven Consumer. Craig has successfully represented premier media brands such as Inc., Forbes, and Investor’s Business Daily and holds a degree from UCLA.',
      focal: '50% 14%',
      zoom: 1.4,
    },
    {
      name: 'Mike Wright',
      title: 'Director, Business Intelligence & Design',
      img: '/images/team/arif.jpg',
      blurb:
        'Leads data access and dashboard delivery, connecting EcoFocus insights to Snowflake users.',
      details:
        "Mike Wright is a dynamic professional with a unique blend of technology and creative graphic design skills and is leading up the Snowflake team working to make EcoFocus data available to Snowflake users. A Web Development and Computer Engineering graduate, he has excelled in roles such as a Data Market Analyst at AMI Corp, where he showcased his analytical and strategic talents. Passionate about sustainable agriculture, particularly hydroponic farming, Mike's environmental advocacy complements his professional pursuits. An avid hiker, his adventurous spirit mirrors his dynamic approach to technology and creativity.",
      focal: '50% 38%',
    },
    {
      name: 'Alex Murrey',
      title: 'Head, Technology & AI',
      img: '/images/team/alex.jpg',
      blurb:
        'Leads technology and AI integration, ensuring agencies can leverage cutting-edge tools for faster, smarter research.',
      details:
        'Alex Murrey is a seasoned technology leader with over seven years of experience in product management, strategic leadership, and research & development. Having worked with companies like Twilio, Launch Consulting, and TangoTeams, with expertise in areas such as AI leadership, cloud transformation, and user experience, Alex has successfully led teams to innovate and deliver customer-centric solutions and has been instrumental in advancing the use of AI at EcoFocus. Alex has a proven track record in driving product strategy, fostering cross-functional collaborations, and leading high-stakes projects in dynamic environments.',
      focal: '50% 40%',
    },
  ];

  const [flipped, setFlipped] = React.useState<Record<number, boolean>>({});
  const toggle = (i: number) => setFlipped((s) => ({ ...s, [i]: !s[i] }));
  const defaultFocal = '50% 35%';

  // 3-line clamp without plugin
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
          An expert team dedicated to translating sustainability insights into
          client-ready strategies, with the rigor and clarity to stand up in the
          boardroom.
        </motion.p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p, i) => {
            const isFlipped = !!flipped[i];

            /** FRONT FACE (flex column; never overflows) */
            const Front = (
              <div className="absolute inset-0 flex h-full w-full flex-col [backface-visibility:hidden]">
                {/* Image (grows/shrinks with card height but keeps a sane minimum) */}
                <div className="relative flex-1 min-h-[190px]">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
                    className="object-cover"
                    style={{
                      objectPosition: p.focal ?? defaultFocal,
                      transform: p.zoom ? `scale(${p.zoom})` : undefined,
                      transformOrigin: p.zoom ? 'center top' : undefined,
                    }}
                    priority={i < 3}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content (fixed minimum so all cards match) */}
                <div className="flex-none px-5 pt-5 pb-2 min-h-[150px]">
                  <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{p.title}</p>
                  <p className="mt-3 text-sm text-gray-700" style={clamp3}>
                    {p.blurb}
                  </p>
                </div>

                {/* Footer / CTA (dedicated row) */}
                <div className="flex-none px-5 pb-4 pt-3 border-t border-gray-200">
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

            // Reduced-motion: show front + expandable details (no 3D)
            if (reduceMotion) {
              return (
                <motion.article
                  key={p.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-white/15 shadow-[0_14px_44px_-18px_rgba(2,12,27,.45)]"
                >
                  <div className="relative aspect-[4/5]">{Front}</div>
                  {isFlipped && (
                    <div className="mx-5 mb-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-200">
                      {p.details ?? p.blurb}
                    </div>
                  )}
                </motion.article>
              );
            }

            // 3D flip
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
                        {Front}

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
                                    style={{
                                      objectPosition: p.focal ?? defaultFocal,
                                      transform: p.zoom ? `scale(${p.zoom})` : undefined,
                                      transformOrigin: p.zoom ? 'center top' : undefined,
                                    }}
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











