'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import MobileNav from './MobileSections/MobileNav';
import Hero from './MobileSections/Hero';
import About from './MobileSections/About';
import Services from './MobileSections/Services';
import ContactModal from './ContactModal';

const tabs = ['home', 'about', 'services', 'contact'] as const;

export default function MobileHome() {
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>('home');
    const [darkMode, setDarkMode] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    // ✅ Load dark mode from localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // ✅ Save dark mode to localStorage
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    // ✅ Render main content based on active tab
    const renderContent = () => {
        if (activeTab === 'contact') {
            setShowContactModal(true);
            setActiveTab('home'); // Reset to prevent overlapping
        }
        switch (activeTab) {
            case 'home':
                return <Hero />;
            case 'about':
                return <About />;
            case 'services':
                return <Services />;
        }
    };

    // ✅ Swipe navigation with haptic feedback
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (showContactModal) return;
            const nextIndex = (tabs.indexOf(activeTab) + 1) % tabs.length;
            setActiveTab(tabs[nextIndex]);
            navigator.vibrate?.(15);
        },
        onSwipedRight: () => {
            if (showContactModal) return;
            const prevIndex = (tabs.indexOf(activeTab) - 1 + tabs.length) % tabs.length;
            setActiveTab(tabs[prevIndex]);
            navigator.vibrate?.(15);
        },
        touchEventOptions: { passive: false },
        trackMouse: false
    });

    return (
        <div {...handlers} className="h-screen flex flex-col bg-white dark:bg-gray-900">
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

            {/* Main Content with animation */}
            <main className="flex-1 overflow-y-auto p-4 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Navigation */}
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

