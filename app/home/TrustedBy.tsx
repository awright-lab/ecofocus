'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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
        <section className="py-20 bg-gray-50 relative">
            <div className="max-w-6xl mx-auto px-6">
                {/* Heading */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="uppercase text-[10px] tracking-wide bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full border border-emerald-200">
                        Partners
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Trusted By <span className="text-emerald-600">Leading Organizations</span>
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl">
                        We work with forward-thinking companies and industry leaders to accelerate sustainability initiatives and drive measurable impact.
                    </p>
                </motion.div>

                {/* Logo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                    {logos.map((logo, i) => (
                        <motion.div
                            key={i}
                            className="relative bg-white rounded-xl p-4 flex items-center justify-center border border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={140}
                                height={60}
                                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500 max-h-16"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* CTA Button (Centered) */}
                <div className="text-center mt-14">
                    <Link
                        href="/partners"
                        className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
                        before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                        before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                    >
                        <span className="relative z-10">Become a Partner →</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}




