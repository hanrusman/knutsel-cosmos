import React from 'react';
import { motion } from 'framer-motion';
import Sparky from './Sparky';

// Map item IDs to visual overlays
const ITEM_OVERLAYS = {
    'rocket-boots': (
        <motion.div
            key="boots"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-orange-500 rounded-b-xl blur-sm opacity-80"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
        />
    ),
    'disco-lights': (
        <motion.div
            key="disco"
            className="absolute top-0 left-0 w-full h-full rounded-full mix-blend-overlay pointer-events-none"
            animate={{ backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ff00ff'] }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ opacity: 0.3 }}
        />
    ),
    'top-hat': (
        <div key="hat" className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-12 bg-black border-b-4 border-gray-700 rounded-t-lg shadow-lg">
            <div className="absolute bottom-0 -left-2 w-20 h-1 bg-black"></div>
        </div>
    ),
    'golden-antenna': (
        <div key="antenna" className="absolute -top-6 right-1/4 w-2 h-8 bg-yellow-400 rounded animate-pulse shadow-[0_0_10px_gold]"></div>
    ),
    'sticker-pack': (
        <div key="stickers" className="absolute top-1/2 left-4 text-2xl -rotate-12 select-none">
            ⭐
        </div>
    )
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
