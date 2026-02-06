import React from 'react';
import { motion } from 'framer-motion';

const Sparky = ({ mood = "happy" }) => {
    return (
        <motion.div
            className="relative w-48 h-72 flex flex-col items-center justify-center pointer-events-auto cursor-pointer"
            animate={{
                y: [0, -10, 0],
            }}
            transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.05, rotate: 2 }}
        >
            {/* New Jar Robot Asset */}
            <img
                src="/assets/sparky-jar.png"
                alt="Sparky the Jar Robot"
                className="w-full h-full object-contain filter drop-shadow-xl"
            />
        </motion.div>
    );
};

export default Sparky;
