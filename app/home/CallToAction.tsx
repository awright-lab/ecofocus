'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CallToAction() {
    return (
        <section className="relative py-24 bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 text-center text-white overflow-hidden">
            {/* Decorative Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>

            <motion.div
                className="relative z-10 max-w-3xl mx-auto px-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Heading */}
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                    Ready to Elevate Your Sustainability Strategy?
                </h2>
                <p className="text-lg md:text-xl text-emerald-50 mb-8">
                    Book a consultation with our experts today and start turning data into actionable impact.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/contact"
                        className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-transform hover:scale-105"
                    >
                        Request a Consultation
                    </Link>
                    <Link
                        href="/solutions"
                        className="bg-emerald-700/50 text-white px-8 py-4 rounded-full font-semibold border border-white/30 hover:bg-emerald-600 transition-transform hover:scale-105"
                    >
                        Explore Solutions
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}

