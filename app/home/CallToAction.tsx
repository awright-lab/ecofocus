'use client';

import Link from 'next/link';

export default function CallToAction() {
    return (
        <section className="py-20 bg-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Ready to Elevate Your Sustainability Strategy?
            </h2>
            <p className="mb-8 text-gray-600">Book a consultation with our experts today.</p>
            <Link
                href="/contact"
                className="bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-700 transition-transform hover:scale-105"
            >
                Request a Consultation
            </Link>
        </section>
    );
}

