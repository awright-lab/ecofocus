'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export default function Leadership() {
  const reduceMotion = useReducedMotion();

  const people = [
    { name: 'Jerry Croft', title: 'Chief Executive Officer', img: '/images/team/jerry.jpg' },
    { name: 'Michael Croft', title: 'VP, Business Development', img: '/images/team/michael.jpg' },
    { name: 'Elinor Gaida', title: 'VP, Research & Strategy', img: '/images/team/elinor.jpg' },
    { name: 'Allison Duncan', title: 'Director, Research & Insights', img: '/images/team/allison.jpg' },
    { name: 'Arif Wright', title: 'Director, Business Intelligence & Design', img: '/images/team/arif.jpg' },
    { name: 'Alex Murrey', title: 'Head, Technology & AI', img: '/images/team/alex.jpg' },
  ];

  return (
    <section className="relative bg-[linear-gradient(180deg,white_0%,#E0F4FF_90%)]" aria-labelledby="leadership">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="leadership"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Leadership
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((p, i) => (
            <motion.article
              key={p.name}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 92vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/15 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{p.title}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
