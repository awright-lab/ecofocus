'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TrustedBy() {
    const logos = [
        { src: '/logo-avery.png', alt: 'Avery' },
        { src: '/logo-cglr.png', alt: 'Council of Great Lakes Region' },
        { src: '/logo-clean-label.png', alt: 'Clean Label Project' },
        { src: '/logo-duraflame.png', alt: 'Duraflame' },
        { src: '/logo-glass.png', alt: 'Glass Packaging Institute' },
        { src: '/logo-thinkparallax.png', alt: 'ThinkParallax' }
    ];

    return (
        <section className="py-20 bg-gray-50 relative">
            <div className="max-w-6xl mx-auto px-6 text-center relative">
                {/* Category Tag */}
                <div className="absolute top-0 left-6">
                    <span className="uppercase text-xs tracking-wide bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                        Partners
                    </span>
                </div>

                {/* Heading & Tagline */}
                <h3 className="text-gray-800 text-2xl md:text-3xl font-bold mb-3">
                    Trusted By Leading Organizations
                </h3>
                <p className="text-gray-600 mb-12 text-sm md:text-base max-w-2xl mx-auto">
                    EcoFocus partners with top innovators and industry leaders to advance sustainability and drive measurable impact.
                </p>

                {/* Logo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 items-center justify-items-center">
                    {logos.map((logo, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center justify-center grayscale hover:grayscale-0 transition-all hover:scale-105"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={150}
                                height={70}
                                className="object-contain max-h-16"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}


