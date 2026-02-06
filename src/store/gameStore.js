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
            equippedItems: [], // IDs of currently worn items

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
                // Find item in definition
                const item = state.shopItems.find(i => i.id === itemId);

                // Validation checks
                if (!item) return false; // Item not found
                if (state.inventory.includes(itemId)) return false; // Already owned
                if (state.coins < item.cost) return false; // Too poor

                // Execute Purchase
                set((state) => ({
                    coins: state.coins - item.cost,
                    inventory: [...state.inventory, itemId],
                    equippedItems: [...state.equippedItems, itemId] // Auto-equip on buy
                }));
                return true;
            },

            toggleEquip: (itemId) => set((state) => {
                // Must own it first
                if (!state.inventory.includes(itemId)) return state;

                const isEquipped = state.equippedItems.includes(itemId);
                return {
                    equippedItems: isEquipped
                        ? state.equippedItems.filter(id => id !== itemId)
                        : [...state.equippedItems, itemId]
                };
            }),

            // Factory Reset
            resetProgress: () => set({
                gears: 0,
                coins: 50,
                unlockedLevels: [1],
                inventory: [],
                equippedItems: []
            })
        }),
        {
            name: 'sparky-storage', // unique name
        }
    )
);

export default useGameStore;
