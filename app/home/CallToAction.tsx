'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CallToAction() {
    return (
        <section className="py-20 bg-white">
            <motion.div
                className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Left Column: Heading + Subheading */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Ready to Elevate Your Sustainability Strategy?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600">
                        Book a consultation with our experts today and start turning data into actionable impact.
                    </p>
                </div>

                {/* Right Column: CTA Buttons */}
                <div className="flex flex-col sm:flex-row md:justify-end gap-4 mt-6 md:mt-0">
                    <Link
                        href="/contact"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
                    >
                        Request a Consultation
                    </Link>
                    <Link
                        href="/solutions"
                        className="bg-gray-100 text-gray-900 px-8 py-4 rounded-full font-semibold border border-gray-300 hover:border-emerald-500 hover:bg-gray-200 transition-transform hover:scale-105"
                    >
                        Explore Solutions
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}



