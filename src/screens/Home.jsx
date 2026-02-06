import React from 'react';
import Workbench from '../components/layout/Workbench';
import CardboardButton from '../components/ui/CardboardButton';
import SparkyAvatar from '../components/character/SparkyAvatar';
import useGameStore from '../store/gameStore';
import { motion } from 'framer-motion';

const Home = ({ onNavigateToMap, onNavigateToShop, onNavigateToAdmin }) => {
    const equippedItems = useGameStore(state => state.equippedItems);

    return (
        <Workbench>
            <div className="flex flex-col items-center justify-center h-full w-full relative gap-4">
                <button
                    onClick={onNavigateToAdmin}
                    className="fixed bottom-4 right-4 text-gray-400 hover:text-gray-800 text-xs uppercase tracking-widest z-50 font-bold bg-white/50 px-2 py-1 rounded border border-gray-300"
                >
                    Admin 🔒
                </button>

                {/* Sparky Section */}
                <div className="flex items-center justify-center flex-1 min-h-0">
                    <SparkyAvatar equipped={equippedItems} />
                </div>

                {/* Buttons Section */}
                <div className="flex gap-8 w-full justify-center pb-6 shrink-0">
                    <CardboardButton onClick={onNavigateToMap}>
                        NAAR DE KAART
                    </CardboardButton>

                    <CardboardButton onClick={onNavigateToShop}>
                        WINKEL
                    </CardboardButton>
                </div>
            </div>
        </Workbench>
    );
};

export default Home;
