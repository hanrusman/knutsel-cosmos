import React from 'react';
import { motion } from 'framer-motion';
import Sparky from './Sparky';

const ITEM_OVERLAYS = {
    'gold-antenna': (
        <motion.img
            key="antenna" src="/assets/items/gold-antenna.png" alt="Antenna"
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 object-contain z-10"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
    ),
    'rocket-boots': (
        <motion.div key="boots" className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-24 z-20 flex justify-center gap-2">
            <motion.img
                src="/assets/items/rocket-boots.png" alt="Boots"
                className="w-32 h-32 object-contain"
                animate={{ y: [0, -10, 0] }} // Hover effect
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            />
        </motion.div>
    ),
    'paint-bucket': (
        <motion.img
            key="paint" src="/assets/items/paint-bucket.png" alt="Paint"
            className="absolute bottom-0 -right-8 w-20 h-20 object-contain z-30"
            initial={{ rotate: 10 }}
        />
    ),
    'disco-ball': (
        <motion.div key="disco" className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <motion.img
                src="/assets/items/disco-ball.png" alt="Disco"
                className="w-24 h-24 object-contain"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            />
            {/* Light beams effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-gradient-radial from-white/20 to-transparent animate-pulse rounded-full mix-blend-overlay" />
        </motion.div>
    ),
    'super-cape': (
        <motion.img
            key="cape" src="/assets/items/super-cape.png" alt="Cape"
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[110%] h-auto object-contain -z-10"
            animate={{ skewX: [-2, 2, -2] }} // Waving effect
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
    ),
    'propeller-hat': (
        <motion.img
            key="propeller" src="/assets/items/propeller-hat.png" alt="Hat"
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 object-contain z-30"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
        />
    ),
    'sunglasses': (
        <motion.img
            key="glasses" src="/assets/items/sunglasses.png" alt="Sunnies"
            className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-auto object-contain z-40"
        />
    ),
    'mustache': (
        <motion.img
            key="mustache" src="/assets/items/mustache.png" alt="Mustache"
            className="absolute top-16 left-1/2 -translate-x-1/2 w-12 h-auto object-contain z-40"
        />
    ),
    'bow-tie': (
        <motion.img
            key="bow" src="/assets/items/bow-tie.png" alt="Bow"
            className="absolute top-24 left-1/2 -translate-x-1/2 w-12 h-auto object-contain z-40"
        />
    ),
    'headphones': (
        <motion.img
            key="phones" src="/assets/items/headphones.png" alt="Headphones"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-auto object-contain z-40"
            animate={{ scale: [1, 1.05, 1] }} // Bobbing to music
            transition={{ repeat: Infinity, duration: 0.6 }}
        />
    ),
    'magic-wand': (
        <motion.img
            key="wand" src="/assets/items/magic-wand.png" alt="Wand"
            className="absolute top-10 -left-10 w-20 h-auto object-contain z-40"
            animate={{ rotate: [0, 15, 0], x: [0, 5, 0] }}
        />
    ),
    'red-balloon': (
        <motion.div
            key="balloon"
            className="absolute -top-32 -right-20 z-50"
            animate={{ y: [0, -20, 0], x: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
            <img src="/assets/items/red-balloon.png" alt="Balloon" className="w-24 h-auto" />
            {/* String line */}
            <div className="absolute top-full left-1/2 w-0.5 h-32 bg-gray-400 origin-top rotate-12"></div>
        </motion.div>
    ),
};

const SparkyAvatar = ({ equipped = [], className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            {/* The Base Sparky */}
            <Sparky mood="happy" />

            {/* Render Equipped Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                {equipped.map(itemId => ITEM_OVERLAYS[itemId] || null)}
            </div>
        </div>
    );
};

export default SparkyAvatar;
