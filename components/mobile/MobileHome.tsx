'use client';

import { useState, useEffect } from 'react';
import MobileNav from './MobileSections/MobileNav';
import Contact from './MobileSections/Contact';
import HeroSection from './MobileSections/Hero';
import QuickStatsSection from './MobileSections/QuickStatsSection';
import FeaturedReportSection from './MobileSections/FeaturedReportSection';
import ServicesSection from './MobileSections/Services';
import EcoNuggetsCard from './MobileSections/EcoNuggetCard';
import WhyChooseSection from './MobileSections/WhyChooseSection';
import PartnersSection from './MobileSections/PartnersSection';
import CTASection from './MobileSections/CTASection';

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
        <div className="bg-white dark:bg-gray-900">
            {/* Header */}
            <header className="flex justify-between items-center p-4">
                <h1 className="font-bold text-xl text-green-600">EcoFocus</h1>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-xs border px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800"
                >
                    {darkMode ? 'Light' : 'Dark'}
                </button>
            </header>

            {/* Sections */}
            <section id="hero"><HeroSection /></section>
            <section id="stats"><QuickStatsSection /></section>
            <section id="report"><FeaturedReportSection /></section>
            <section id="services"><ServicesSection /></section>
            <section id="nuggets"><EcoNuggetsCard /></section>
            <section id="why"><WhyChooseSection /></section>
            <section id="partners"><PartnersSection /></section>
            <section id="cta"><CTASection /></section>

            {/* FAB and Bottom Nav */}
            <Contact />
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}





