'use client';

import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Newsletter signup:', email);
        setEmail('');
    };

    return (
        <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white relative overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
                        <i className="ri-mail-line text-white"></i>
                        Weekly Newsletter
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Stay Ahead of Sustainability Trends
                    </h2>
                    <p className="text-xl mb-10 text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                        Get weekly insights, research updates, and industry trends delivered directly to your inbox
                    </p>

                    {/* Newsletter Form */}
                    <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg backdrop-blur-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                            >
                                Subscribe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
