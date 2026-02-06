import React from 'react';
import { motion } from 'framer-motion';

const Sparky = () => {
    return (
        <motion.div
            className="relative w-48 h-64 flex flex-col items-center justify-center pointer-events-auto cursor-pointer"
            animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0]
            }}
            transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
        >
            {/* Hat / Lid */}
            <div className="w-32 h-8 bg-cardboard-dark border-2 border-black rounded-sm relative z-20 shadow-md">
                {/* Antenna */}
                <motion.div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-2 h-12 bg-black origin-bottom"
                    animate={{ rotate: [-5, 5] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                >
                    <div className="w-6 h-6 bg-yellow-400 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 border-2 border-black" />
                </motion.div>
            </div>

            {/* Jar Body */}
            <div className="w-32 h-40 bg-blue-100/30 border-4 border-gray-400 rounded-2xl relative backdrop-blur-sm overflow-visible z-10 flex items-center justify-center">
                {/* Reflection */}
                <div className="absolute top-4 left-4 w-4 h-24 bg-white/40 rounded-full skew-y-12"></div>

                {/* Face (Cardboard cutout inside jar) */}
                <div className="w-20 h-20 bg-cardboard border-2 border-black rounded-lg flex flex-col items-center justify-center gap-2 shadow-inner">
                    {/* Eyes */}
                    <div className="flex gap-4">
                        <div className="w-4 h-4 bg-black rounded-full" />
                        <div className="w-4 h-4 bg-black rounded-full" />
                    </div>
                    {/* Mouth */}
                    <div className="w-8 h-4 border-b-4 border-black rounded-full" />
                </div>
            </div>

            {/* Legs (Paintbrushes) */}
            <div className="flex gap-12 -mt-4 z-0">
                <motion.div
                    className="w-4 h-24 bg-orange-800 border-black border-2 rounded-b-md relative"
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {/* Brush bristles */}
                    <div className="absolute bottom-0 w-full h-8 bg-yellow-900 rounded-b-md opacity-80" />
                </motion.div>
                <motion.div
                    className="w-4 h-24 bg-orange-800 border-black border-2 rounded-b-md relative"
                    animate={{ rotate: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                    {/* Brush bristles */}
                    <div className="absolute bottom-0 w-full h-8 bg-yellow-900 rounded-b-md opacity-80" />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Sparky;
