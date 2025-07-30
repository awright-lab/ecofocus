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
        <section className="relative py-24 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white overflow-hidden">
            {/* Floating orbs */}
            <div className="absolute top-10 left-[-100px] w-[250px] h-[250px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-120px] right-[-80px] w-[220px] h-[220px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Heading */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="uppercase text-[10px] tracking-wide bg-emerald-500/10 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/20 mb-4 inline-block">
                        Partners
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Trusted By <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">Leading Organizations</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        We partner with forward-thinking companies to accelerate sustainability and create measurable impact.
                    </p>
                </motion.div>

                {/* Logo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                    {logos.map((logo, i) => (
                        <motion.div
                            key={i}
                            className="relative bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-center border border-white/10 hover:border-emerald-400/40 shadow-lg hover:shadow-emerald-500/30 transition-all group"
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

                {/* CTA Button */}
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



