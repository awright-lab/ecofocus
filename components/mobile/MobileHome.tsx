'use client';

import { useState, useEffect } from 'react';
import MobileNav from './MobileSections/MobileNav';
import HeroSection from './MobileSections/Hero';
import EcoNuggetCard from './MobileSections/EcoNuggetCard';
import ContactFAB from './MobileSections/Contact';

const ecoNuggets = [
    { id: 1, title: "74% of Gen Z consumers prioritize sustainability.", tag: "Gen Z Trends", cta: "Learn More" },
    { id: 2, title: "Eco-friendly packaging boosts purchase intent by 35%.", tag: "Packaging", cta: "Learn More" },
    { id: 3, title: "91% of Millennials expect companies to be sustainable.", tag: "Corporate Commitments", cta: "Learn More" },
    { id: 4, title: "Consumers trust brands 2x more when transparent.", tag: "Trust & Transparency", cta: "Learn More" },
    { id: 5, title: "42% pay more for certified eco-label products.", tag: "Certifications", cta: "Learn More" }
];

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

            {/* Main Content with scroll snapping */}
            <main className="flex-1 overflow-y-auto snap-y">
                <section className="snap-start p-4">
                    <HeroSection />
                </section>
                {ecoNuggets.map((nugget) => (
                    <section key={nugget.id} className="snap-start p-4 min-h-screen flex items-center">
                        <EcoNuggetCard title={nugget.title} tag={nugget.tag} cta={nugget.cta} />
                    </section>
                ))}
            </main>

            <ContactFAB />
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}



