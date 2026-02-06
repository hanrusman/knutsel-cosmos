import React, { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import Workbench from '../components/layout/Workbench';
import CardboardButton from '../components/ui/CardboardButton';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import SparkyAvatar from '../components/character/SparkyAvatar';

const ShopScreen = ({ onBack }) => {
    const { coins, inventory, shopItems, purchaseItem, equippedItems, toggleEquip } = useGameStore();

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showNotification = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
    };

    const handleBuy = (item) => {
        const success = purchaseItem(item.id);
        if (success) {
            showNotification(`Je hebt de ${item.name} gekocht! 🎉`, 'success');
        } else {
            if (inventory.includes(item.id)) {
                showNotification("Je hebt dit al!", 'error');
            } else {
                showNotification("Niet genoeg muntjes!", 'error');
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

            <div className="flex flex-col w-full h-full p-2 overflow-hidden">
                {/* Compact Header Row: Back + Title + Sparky Preview + Coins */}
                <div className="flex items-center justify-between w-full max-w-5xl mb-4 shrink-0 z-20">
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-black bg-white px-5 py-2 rotate-minus-2 border-4 border-dashed border-gray-800 shadow-xl font-hand">
                        DE ROMMELMARKT
                    </h1>

                    {/* Mini Sparky Preview - Optimized for size */}
                    <div className="scale-[0.4] origin-center -mx-8 -my-12 z-10 pointer-events-none">
                        <SparkyAvatar equipped={equippedItems} />
                    </div>

                    {/* Coin Balance */}
                    <div className="bg-yellow-100 px-4 py-2 border-2 border-yellow-600 rounded-full shadow-md flex items-center gap-2 text-lg font-bold rotate-1">
                        <span className="text-yellow-500 text-2xl">●</span>
                        <span>{coins}</span>
                    </div>
                </div>

                {/* Scrollable Shop Shelf & Footer - Explicit Overflow Handling */}
                <div className="flex-1 w-full max-w-5xl overflow-y-auto px-4 pb-4 custom-scrollbar min-h-0 mask-image-gradient relative z-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 pt-8">
                        {shopItems.map((item, idx) => {
                            const isOwned = inventory.includes(item.id);
                            const isEquipped = equippedItems.includes(item.id);
                            const canAfford = coins >= item.cost;

                            // Use index based rotation for consistency
                            const rotate = idx % 2 === 0 ? 'rotate-1' : '-rotate-1';

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.05, rotate: 0 }}
                                    className={clsx(
                                        "relative bg-[#d4c5a9] p-4 shadow-xl flex flex-col items-center gap-2 transition-all border-4 border-dashed border-black/10 min-h-[250px]",
                                        rotate,
                                        isOwned ? "opacity-90 grayscale-[0.2]" : ""
                                    )}
                                    style={{
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23a19379\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")',
                                    }}
                                >
                                    {/* Tape effect */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-1 shadow-sm backdrop-blur-sm" />

                                    {/* Price Tag */}
                                    {!isOwned && (
                                        <div className="absolute -top-3 -right-3 bg-yellow-300 text-yellow-900 border-2 border-yellow-600 px-3 py-1 font-black text-lg z-10 shadow-lg rotate-12 flex flex-col items-center leading-none">
                                            <span>🪙 {item.cost}</span>
                                        </div>
                                    )}

                                    {/* Equipped Tag */}
                                    {isEquipped && (
                                        <div className="absolute top-2 right-2 bg-blue-500 text-white border-2 border-white px-2 py-0.5 font-bold z-10 shadow-md rotate-3 text-[10px]">
                                            AAN
                                        </div>
                                    )}

                                    {/* Item Icon */}
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-gray-200 group-hover:scale-110 transition-transform relative overflow-hidden p-2 mt-2">
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className="w-full h-full object-contain filter drop-shadow-md"
                                        />
                                    </div>

                                    <div className="text-center w-full bg-white/50 p-2 transform -skew-x-2">
                                        <h3 className="text-lg font-black uppercase tracking-tight text-gray-800 font-hand">{item.name}</h3>
                                        <p className="text-[10px] text-gray-600 font-serif italic leading-tight mt-1 px-1">
                                            {/* Dynamic "Funny" descriptions based on item ID */}
                                            {item.id === 'gold-antenna' && "Vangt signalen uit de ruimte (misschien)."}
                                            {item.id === 'mustache' && "Staat deftig bij elke gelegenheid."}
                                            {item.id === 'sunglasses' && "Om cool te doen, zelfs in het donker."}
                                            {item.id === 'rocket-boots' && "Pas op: Kan brandplekken maken."}
                                            {item.id === 'bow-tie' && "Voor als je op audiëntie gaat."}
                                            {item.id === 'paint-bucket' && "Word een kunstenaar!"}
                                            {item.id === 'headphones' && "Hoor de sterren zingen."}
                                            {item.id === 'propeller-hat' && "Voor een luchtig gevoel."}
                                            {item.id === 'red-balloon' && "Pas op voor cactussen!"}
                                            {item.id === 'magic-wand' && "Hocus Pocus Pilatus..."}
                                            {item.id === 'disco-ball' && "Dansen tijdens het rekenen."}
                                            {item.id === 'super-cape' && "Is het een vogel? Nee."}
                                        </p>
                                    </div>

                                    <div className="mt-auto w-full pt-2">
                                        {isOwned ? (
                                            <button
                                                onClick={() => toggleEquip(item.id)}
                                                className={clsx(
                                                    "w-full px-2 py-2 font-bold uppercase rounded-sm border-2 border-dashed transition-all transform active:scale-95 text-sm",
                                                    isEquipped
                                                        ? "bg-red-100 text-red-800 border-red-400 hover:bg-red-200"
                                                        : "bg-green-100 text-green-800 border-green-400 hover:bg-green-200"
                                                )}
                                            >
                                                {isEquipped ? 'UIT' : 'AAN'}
                                            </button>
                                        ) : (
                                            <CardboardButton
                                                onClick={() => handleBuy(item)}
                                                className={clsx(
                                                    "!w-full !px-3 !py-2 !text-sm transition-all",
                                                    canAfford
                                                        ? "bg-green-500 hover:bg-green-600 text-white border-green-700 hover:scale-105"
                                                        : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-70"
                                                )}
                                            >
                                                {canAfford ? 'KOOP' : 'SPAAR'}
                                            </CardboardButton>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-4 z-0 pb-8 flex justify-center">
                        <p className="text-gray-500 italic bg-white/80 p-2 rotate-1 border border-gray-300 shadow-sm max-w-sm text-center text-xs">
                            "Geen garantie. We geven geen muntjes terug!" - De Directie
                        </p>
                    </div>
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className={clsx(
                                "fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full shadow-2xl border-4 z-[100] text-xl font-bold font-hand",
                                toast.type === 'success' ? "bg-green-100 text-green-800 border-green-500" : "bg-red-100 text-red-800 border-red-500"
                            )}
                        >
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </Workbench>
    );
};

export default ShopScreen;
