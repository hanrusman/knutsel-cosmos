import React from 'react';
import useGameStore from '../store/gameStore';
import Workbench from '../components/layout/Workbench';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import CardboardButton from '../components/ui/CardboardButton';

const levels = [
    { id: 1, title: 'RUIMTEVAART\nQUIZ 1', x: 100, y: 50 },
    { id: 2, title: 'QUIZ 2', x: 300, y: 30 }, // Wobbly path
    { id: 3, title: 'QUIZ 3', x: 500, y: 60 },
    { id: 4, title: 'QUIZ 4', x: 700, y: 20 },
    { id: 5, title: 'FINALE', x: 900, y: 50 },
];

const MapScreen = ({ onBack, onSelectLevel }) => {
    const { unlockedLevels } = useGameStore();

    return (
        <Workbench>
            <div className="absolute top-4 left-4 z-50">
                <CardboardButton onClick={onBack} className="!px-4 !py-2 !text-lg">
                    ← TERUG
                </CardboardButton>
            </div>

            <div className="flex-1 w-full min-h-0 overflow-x-auto overflow-y-hidden custom-scrollbar relative flex items-center">
                {/* Paper Map Background */}
                <div className="absolute inset-x-0 h-4/5 mx-8 bg-white opacity-80 rotate-1 shadow-md border-2 border-gray-300 rounded-sm transform origin-left" style={{ minWidth: '1000px' }}>
                    {/* Crumpled paper texture overlay could go here */}
                </div>

                {/* Path Container (scrolling content) */}
                <div className="relative h-full" style={{ minWidth: '1000px' }}>

                    {/* Dashed Line Path */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <path
                            d="M 150 150 Q 300 100 350 150 T 550 180 T 750 120 T 950 150"
                            fill="none"
                            stroke="#555"
                            strokeWidth="4"
                            strokeDasharray="10,10"
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Nodes */}
                    {levels.map((level, index) => {
                        const isUnlocked = unlockedLevels.includes(level.id);
                        // Simple positioning logic for prototype - in real app, match SVG path
                        // Using absolute positions based on the levels array for control
                        // We need to map the abstract 'x/y' from array to standard coords.
                        // Let's just create a row for now since SVG logic matches visual better if manually tweaked.
                        // Override positions for the prototype to match the dashed line roughly.
                        const positions = [
                            { top: '45%', left: '100px' },
                            { top: '40%', left: '300px' },
                            { top: '55%', left: '500px' },
                            { top: '35%', left: '700px' },
                            { top: '45%', left: '900px' },
                        ];

                        return (
                            <motion.div
                                key={level.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2"
                                style={positions[index]}
                                whileHover={isUnlocked ? { scale: 1.1 } : {}}
                            >
                                <div
                                    className={clsx(
                                        "w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-lg transition-colors cursor-pointer",
                                        isUnlocked
                                            ? "bg-green-400 border-green-600 animate-pulse-slow"
                                            : "bg-gray-400 border-gray-600"
                                    )}
                                    onClick={() => isUnlocked && onSelectLevel(level.id)}
                                >
                                    {isUnlocked ? (
                                        <span className="text-3xl">🚀</span>
                                    ) : (
                                        <span className="text-3xl opacity-50">🔒</span>
                                    )}
                                </div>

                                <div className={clsx(
                                    "font-hand font-bold text-center bg-paper px-2 py-1 rounded shadow-sm border border-gray-400",
                                    !isUnlocked && "opacity-50"
                                )}
                                >
                                    {level.title}
                                </div>

                                {/* Stars */}
                                {isUnlocked && unlockedLevels.length > level.id && ( // Show stars if completed (simple heuristic: next level unlocked implies this one done, OR check score)
                                    // Better: use levelScores
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(s => {
                                            const score = useGameStore.getState().levelScores[level.id];
                                            const earned = score && score.stars >= s;
                                            return (
                                                <span key={s} className={clsx("text-sm", earned ? "grayscale-0" : "grayscale opacity-30")}>
                                                    ⭐
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Workbench>
    );
};

export default MapScreen;
