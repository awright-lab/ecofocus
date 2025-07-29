'use client';

import { motion } from 'framer-motion';

export default function FloatingOrbs() {
    const orbs = [
        { size: 150, top: '10%', left: '15%', color: 'from-emerald-400 to-blue-500' },
        { size: 200, top: '60%', left: '70%', color: 'from-blue-400 to-cyan-500' },
        { size: 100, top: '40%', left: '30%', color: 'from-emerald-300 to-green-500' },
    ];

    return (
        <>
            {orbs.map((orb, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full bg-gradient-to-br ${orb.color} opacity-20 blur-3xl`}
                    style={{
                        width: orb.size,
                        height: orb.size,
                        top: orb.top,
                        left: orb.left,
                        zIndex: 0
                    }}
                    animate={{
                        y: [0, 15, 0],
                        x: [0, 10, 0]
                    }}
                    transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        repeatType: 'reverse'
                    }}
                ></motion.div>
            ))}
        </>
    );
}
