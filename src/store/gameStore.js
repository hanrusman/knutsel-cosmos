import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
    persist(
        (set, get) => ({
            // Game State
            gears: 0,
            coins: 50, // Start with some coins for testing
            unlockedLevels: [1], // Level 1 is unlocked by default
            levelScores: {},
            sessionAnsweredIds: [], // Track answered questions this session (non-persisted via filter ideally, or persist is fine) // { levelId: { score: 0, stars: 0 } }

            // Economy & Inventory
            inventory: [], // Array of item IDs owned by player
            equippedItems: [], // IDs of currently worn items

            shopItems: [
                { id: 'gold-antenna', name: 'Gouden Antenne', cost: 10, icon: '/assets/items/gold-antenna.png' },
                { id: 'mustache', name: 'Snor', cost: 15, icon: '/assets/items/mustache.png' },
                { id: 'sunglasses', name: 'Zonnebril', cost: 20, icon: '/assets/items/sunglasses.png' },
                { id: 'rocket-boots', name: 'Raket Laarzen', cost: 25, icon: '/assets/items/rocket-boots.png' },
                { id: 'bow-tie', name: 'Strikje', cost: 30, icon: '/assets/items/bow-tie.png' },
                { id: 'paint-bucket', name: 'Verf Emmer', cost: 35, icon: '/assets/items/paint-bucket.png' },
                { id: 'headphones', name: 'Koptelefoon', cost: 40, icon: '/assets/items/headphones.png' },
                { id: 'propeller-hat', name: 'Propeller Pet', cost: 45, icon: '/assets/items/propeller-hat.png' },
                { id: 'red-balloon', name: 'Rode Ballon', cost: 50, icon: '/assets/items/red-balloon.png' },
                { id: 'magic-wand', name: 'Toverstaf', cost: 75, icon: '/assets/items/magic-wand.png' },
                { id: 'disco-ball', name: 'Disco Bal', cost: 100, icon: '/assets/items/disco-ball.png' },
                { id: 'super-cape', name: 'Super Cape', cost: 150, icon: '/assets/items/super-cape.png' },
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

            recordAnsweredId: (id) => set((state) => ({
                sessionAnsweredIds: [...state.sessionAnsweredIds, id]
            })),

            saveLevelScore: (levelId, score, maxScore) => set((state) => {
                const percentage = (score / maxScore) * 100;
                let stars = 1;
                if (percentage >= 80) stars = 3;
                else if (percentage >= 50) stars = 2;

                // Only update if better? Or always? Let's keep best.
                const current = state.levelScores[levelId] || { score: 0, stars: 0 };
                if (score > current.score) {
                    return {
                        levelScores: {
                            ...state.levelScores,
                            [levelId]: { score, stars }
                        }
                    };
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
            name: 'sparky-storage',
            partialize: (state) => ({
                gears: state.gears,
                coins: state.coins,
                unlockedLevels: state.unlockedLevels,
                levelScores: state.levelScores,
                inventory: state.inventory,
                equippedItems: state.equippedItems
                // Explicitly EXCLUDE 'shopItems' so new code updates apply
            }),
        }
    )
);

export default useGameStore;
