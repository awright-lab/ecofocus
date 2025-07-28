'use client';

import Link from 'next/link';

export default function CallToAction() {
    return (
        <section className="py-20 bg-emerald-600 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Sustainability Strategy?
            </h2>
            <p className="mb-8 text-lg">Book a consultation with our experts today.</p>
            <Link
                href="/contact"
                className="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
                Request a Consultation
            </Link>
        </section>
    );
}
