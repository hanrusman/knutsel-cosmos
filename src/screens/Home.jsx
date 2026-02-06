import React from 'react';
import Workbench from '../components/layout/Workbench';
import CardboardButton from '../components/ui/CardboardButton';
import Sparky from '../components/character/Sparky';
import { motion } from 'framer-motion';

const Home = ({ onNavigateToMap, onNavigateToShop, onNavigateToAdmin }) => {
    return (
        <Workbench>
            <div className="flex flex-col items-center gap-8 w-full relative">
                <button
                    onClick={onNavigateToAdmin}
                    className="absolute -top-12 -left-32 text-gray-300 hover:text-gray-500 text-xs uppercase tracking-widest"
                >
                    Admin
                </button>

                {/* Sparky Section */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <Sparky />
                </div>

                {/* Buttons Section */}
                <div className="flex gap-8 w-full justify-center">
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
