'use client';

import { motion } from 'framer-motion';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-t-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-4 text-center">Contact Us</h2>
                <form className="space-y-4">
                    <input type="text" placeholder="Your Name" className="w-full border p-2 rounded dark:bg-gray-800" />
                    <input type="email" placeholder="Your Email" className="w-full border p-2 rounded dark:bg-gray-800" />
                    <textarea placeholder="Your Message" className="w-full border p-2 rounded dark:bg-gray-800" rows={4}></textarea>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded w-full"
                    >
                        Send
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
}


