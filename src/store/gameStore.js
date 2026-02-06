import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
    persist(
        (set, get) => ({
            // Game State
            gears: 0,
            coins: 50, // Start with some coins for testing
            unlockedLevels: [1], // Level 1 is unlocked by default

            // Economy & Inventory
            inventory: [], // Array of item IDs owned by player
            shopItems: [
                { id: 'gold-antenna', name: 'Gouden Antenne', cost: 10, icon: '🏆' },
                { id: 'rocket-boots', name: 'Raket Laarzen', cost: 25, icon: '🚀' },
                { id: 'paint-bucket', name: 'Verf Emmer', cost: 50, icon: '🎨' },
                { id: 'disco-lights', name: 'Disco Lichten', cost: 100, icon: '✨' },
                { id: 'super-sparky', name: 'Super Sparky Suit', cost: 250, icon: '🦸' },
            ],

            // Actions
            addGears: (amount) => set((state) => ({ gears: state.gears + amount })),

            addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

            unlockLevel: (levelId) => set((state) => {
                if (!state.unlockedLevels.includes(levelId)) {
                    return { unlockedLevels: [...state.unlockedLevels, levelId] };
                }
                return state;
            }),

            purchaseItem: (itemId) => {
                const state = get();
                const item = state.shopItems.find(i => i.id === itemId);

                // Validation: Item exists, Player can afford, Player doesn't own it
                if (item && state.coins >= item.cost && !state.inventory.includes(itemId)) {
                    set({
                        coins: state.coins - item.cost,
                        inventory: [...state.inventory, itemId]
                    });
                    return true; // Purchase successful
                }
                return false; // Purchase failed
            }
        }),
        {
            name: 'sparky-storage', // unique name
        }
    )
);

export default useGameStore;
