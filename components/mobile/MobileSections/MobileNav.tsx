'use client';

import { motion } from 'framer-motion';
import { FaHome, FaBookOpen, FaBookmark, FaUser } from 'react-icons/fa';

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
    const items = [
        { id: 'hero', label: 'Home', icon: <FaHome size={22} /> },
        { id: 'report', label: 'Reports', icon: <FaBookOpen size={22} /> },
        { id: 'nuggets', label: 'Insights', icon: <FaBookmark size={22} /> },
        { id: 'cta', label: 'Contact', icon: <FaUser size={22} /> }
    ];

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg flex justify-around items-center py-3 shadow-xl">
            {items.map((item) => (
                <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setActiveTab(item.id);
                        scrollToSection(item.id);
                    }}
                    className={`flex flex-col items-center text-xs ${activeTab === item.id ? 'text-green-600 font-semibold' : 'text-gray-500'
                        }`}
                >
                    <div
                        className={`p-2 rounded-full ${activeTab === item.id ? 'bg-green-600 text-white shadow-glow' : ''
                            }`}
                    >
                        {item.icon}
                    </div>
                    <span>{item.label}</span>
                </motion.button>
            ))}
            <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
        }
      `}</style>
        </nav>
    );
}




  
  