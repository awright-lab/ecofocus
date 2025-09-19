"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function Leadership() {
  const reduceMotion = useReducedMotion();

  const people = [
    {
      name: "Jerry Croft",
      title: "Chief Executive Officer",
      img: "/images/team/jerry.jpg",
      blurb:
        "Guides EcoFocus’ vision and agency partnerships, ensuring insights translate into meaningful campaigns and client growth.",
    },
    {
      name: "Michael Croft",
      title: "VP, Business Development",
      img: "/images/team/michael.jpg",
      blurb:
        "Connects agencies with EcoFocus data, helping them win pitches and deliver strategies rooted in sustainability insights.",
    },
    {
      name: "Elinor Gaida",
      title: "VP, Research & Strategy",
      img: "/images/team/elinor.jpg",
      blurb:
        "Leads study design and strategic frameworks, bridging rigorous data with actionable direction for brand teams and agencies.",
    },
    {
      name: "Allison Duncan",
      title: "Director, Research & Insights",
      img: "/images/team/allison.jpg",
      blurb:
        "Transforms data into narratives agencies can use directly in briefs, decks, and campaigns.",
    },
    {
      name: "Arif Wright",
      title: "Director, Business Intelligence & Design",
      img: "/images/team/arif.jpg",
      blurb:
        "Shapes EcoFocus dashboards and design outputs, making insights accessible, visual, and client-ready.",
    },
    {
      name: "Alex Murrey",
      title: "Head, Technology & AI",
      img: "/images/team/alex.jpg",
      blurb:
        "Leads technology and AI integration, ensuring agencies can leverage cutting-edge tools for faster, smarter research.",
    },
  ];

  return (
    <section
      className="relative section-slab-deep bg-grid-soft"
      aria-labelledby="leadership"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="leadership"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-center font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Leadership
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
          {people.map((p, i) => (
            <motion.article
              key={p.name}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-lg"
            >
              <div className="relative aspect-square">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/15 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{p.title}</p>
                <p className="mt-3 text-sm text-gray-700">{p.blurb}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}



