import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const CardboardButton = ({ children, onClick, className, variant = 'primary' }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95, rotate: -2, y: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            onClick={onClick}
            className={clsx(
                "relative px-8 py-4 font-bold text-2xl tracking-widest uppercase",
                "border-4 border-cardboard-dark text-cardboard-dark bg-cardboard shadow-cardboard",
                "flex items-center justify-center",
                className
            )}
            style={{
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.5)', // Hard shadow for cutout effect
            }}
        >
            {/* "Corrugated" edge effect (simplified) */}
            <div className="absolute inset-0 border-2 border-white/20 pointer-events-none"></div>

            {children}
        </motion.button>
    );
};

export default CardboardButton;
