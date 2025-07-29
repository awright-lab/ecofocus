'use client';

import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';

export default function ContactFAB() {
    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-20 right-5 bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-400"
        >
            <FaEnvelope size={20} />
        </motion.button>
    );
}


  