import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Sparky = ({ mood = "happy" }) => {
    return (
        <motion.div
            className="relative w-48 h-72 flex flex-col items-center justify-center pointer-events-auto cursor-pointer"
            animate={{
                y: [0, -10, 0],
                rotate: mood === 'sad' ? 0 : [0, 2, -2, 0], // Less wiggle when sad
            }}
            transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.05 }}
        >
            {/* New Jar Robot Asset */}
            <img
                src="/assets/sparky-jar.png"
                alt="Sparky the Jar Robot"
                className={clsx(
                    "w-full h-full object-contain filter drop-shadow-xl transition-all duration-500",
                    mood === 'sad' && "grayscale contrast-125 brightness-75 sepia-[.3]" // Sad look
                )}
            />
        </motion.div>
    );
};

export default Sparky;
