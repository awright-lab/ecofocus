'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TrustedBy() {
    const logos = [
        { src: '/images/logos/Avery Logo_Light Backgrounds.png', alt: 'Avery' },
        { src: '/images/logos/CGLR-Icon.png', alt: 'Council of the Great Lakes Region' },
        { src: '/images/logos/clean_label.png', alt: 'Clean Label Project' },
        { src: '/images/logos/duraflame-logo.png', alt: 'Duraflame' },
        { src: '/images/logos/Site_GPI Logo 2_0.png', alt: 'Glass Packaging Institute' },
        { src: '/images/logos/thinkPARALLAX_Logos_RBW-01-bug.png', alt: 'thinkPARALLAX' }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h3 className="text-gray-800 text-lg font-semibold tracking-wide mb-8">
                    Trusted By Leading Organizations
                </h3>

                {/* Logo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
                    {logos.map((logo, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center justify-center grayscale hover:grayscale-0 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={60}
                                className="object-contain max-h-10"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

