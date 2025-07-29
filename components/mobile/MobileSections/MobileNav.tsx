'use client';

import { motion } from 'framer-motion';
import { FaHome, FaInfoCircle, FaServicestack, FaEnvelope } from 'react-icons/fa';

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: 'home' | 'about' | 'services' | 'contact') => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
    const items = [
        { id: 'home', label: 'Home', icon: <FaHome size={22} /> },
        { id: 'about', label: 'About', icon: <FaInfoCircle size={22} /> },
        { id: 'services', label: 'Services', icon: <FaServicestack size={22} /> },
        { id: 'contact', label: 'Contact', icon: <FaEnvelope size={22} /> }
    ];

    return (
        <nav className="flex justify-around p-3 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 relative">
            {items.map((item) => (
                <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setActiveTab(item.id as any);
                        navigator.vibrate?.(20); // ✅ Vibration feedback
                    }}
                    className={`flex flex-col items-center text-xs ${activeTab === item.id ? 'text-green-600 font-bold' : 'text-gray-500'
                        }`}
                >
                    {item.icon}
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                        <motion.div
                            layoutId="underline"
                            className="h-1 w-6 bg-green-600 rounded mt-1"
                        />
                    )}
                </motion.button>
            ))}
        </nav>
    );
}


  
  