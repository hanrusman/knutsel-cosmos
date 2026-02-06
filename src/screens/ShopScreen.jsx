import React from 'react';
import useGameStore from '../store/gameStore';
import Workbench from '../components/layout/Workbench';
import CardboardButton from '../components/ui/CardboardButton';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import SparkyAvatar from '../components/character/SparkyAvatar';

const ShopScreen = ({ onBack }) => {
    const { coins, inventory, shopItems, purchaseItem, equippedItems, toggleEquip } = useGameStore();

    const handleBuy = (item) => {
        const success = purchaseItem(item.id);
        if (success) {
            // Could trigger a sound or smaller confetti here
            alert(`Je hebt de ${item.name} gekocht!`);
        } else {
            if (inventory.includes(item.id)) {
                alert("Je hebt dit al!");
            } else {
                alert("Niet genoeg muntjes!");
            }
        }
    };

    return (
        <Workbench>
            <div className="absolute top-4 left-4 z-50">
                <CardboardButton onClick={onBack} className="!px-4 !py-2 !text-lg">
                    ← TERUG
                </CardboardButton>
            </div>

            <div className="flex flex-col w-full h-full items-center p-4">
                {/* Header with Coin Balance and Avatar */}
                <div className="flex flex-col items-center mb-8 relative w-full max-w-4xl">
                    <div className="absolute top-0 right-0 z-10">
                        <div className="bg-yellow-100 px-6 py-2 border-2 border-yellow-600 rounded-full shadow-md flex items-center gap-2 text-2xl font-bold rotate-1">
                            <span>🪙</span>
                            <span>{coins}</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold bg-white px-6 py-2 rotate-minus-1 border-2 border-dashed border-gray-400 shadow-sm mb-4">
                        WINKEL
                    </h1>

                    {/* Live Preview of Sparky */}
                    <div className="scale-75 origin-top">
                        <SparkyAvatar equipped={equippedItems} />
                    </div>
                </div>

                {/* Shop Shelf */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl overflow-y-auto p-4 custom-scrollbar">
                    {shopItems.map((item) => {
                        const isOwned = inventory.includes(item.id);
                        const isEquipped = equippedItems.includes(item.id);
                        const canAfford = coins >= item.cost;

                        return (
                            <motion.div
                                key={item.id}
                                className={clsx(
                                    "relative bg-cardboard p-4 border-2 border-black/10 shadow-lg flex flex-col items-center gap-4 transition-all",
                                    isOwned ? "bg-cardboard-light" : "hover:scale-105 hover:-rotate-1",
                                    isEquipped && "ring-4 ring-green-500 ring-offset-2"
                                )}
                            >
                                {/* Price Tag */}
                                {!isOwned && (
                                    <div className="absolute -top-3 -right-3 bg-green-100 text-green-800 border border-green-600 px-3 py-1 font-bold z-10 shadow-sm rotate-12">
                                        🪙 {item.cost}
                                    </div>
                                )}

                                {/* Equipped Tag */}
                                {isEquipped && (
                                    <div className="absolute -top-3 -left-3 bg-blue-500 text-white border border-blue-700 px-3 py-1 font-bold z-10 shadow-sm -rotate-12">
                                        AAN
                                    </div>
                                )}

                                {/* Item Icon (Placeholder) */}
                                <div className="w-32 h-32 bg-white/50 rounded-full flex items-center justify-center text-6xl shadow-inner border border-white/60">
                                    {item.icon}
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold uppercase tracking-wider">{item.name}</h3>
                                </div>

                                <div className="mt-auto w-full">
                                    {isOwned ? (
                                        <button
                                            onClick={() => toggleEquip(item.id)}
                                            className={clsx(
                                                "w-full px-4 py-2 font-bold uppercase rounded-sm border-2 transition-colors",
                                                isEquipped
                                                    ? "bg-blue-100 text-blue-800 border-blue-500 hover:bg-red-100 hover:text-red-800 hover:border-red-500" // Hover to unequip
                                                    : "bg-gray-200 text-gray-700 border-gray-400 hover:bg-green-100 hover:border-green-500" // Hover to equip
                                            )}
                                        >
                                            {isEquipped ? 'UITDOEN' : 'AANDOEN'}
                                        </button>
                                    ) : (
                                        <CardboardButton
                                            onClick={() => handleBuy(item)}
                                            className={clsx(
                                                "!w-full !px-6 !py-2 !text-lg transition-colors",
                                                canAfford ? "bg-green-500 text-white border-green-700" : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                                            )}
                                        >
                                            KOOP
                                        </CardboardButton>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-8">
                    <p className="text-gray-500 italic bg-white/80 px-2 rotate-1">
                        "Meer items komen binnenkort!"
                    </p>
                </div>

            </div>
        </Workbench>
    );
};

export default ShopScreen;
