'use client';

import { useState, useEffect } from 'react';
import MobileNav from './MobileSections/MobileNav';
import ContactFAB from './MobileSections/Contact';
import HeroSection from './MobileSections/Hero';
import AboutSection from './MobileSections/About';
import ServicesSection from './MobileSections/Services';
import FeaturedReportSection from './MobileSections/FeaturedReportSection';

export default function MobileHome() {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
                <h1 className="font-bold text-xl text-green-600">EcoFocus</h1>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-xs border px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800"
                >
                    {darkMode ? 'Light' : 'Dark'}
                </button>
            </header>

            {/* Scroll Snap Sections */}
            <main className="flex-1 overflow-y-auto snap-y snap-mandatory">
                <section className="snap-start h-screen p-4 flex items-center justify-center">
                    <HeroSection />
                </section>
                <section className="snap-start h-screen p-4 flex items-center">
                    <AboutSection />
                </section>
                <section className="snap-start h-screen p-4">
                    <ServicesSection />
                </section>
                <section className="snap-start h-screen p-4 flex items-center">
                    <FeaturedReportSection />
                </section>
            </main>

            <ContactFAB />
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}




