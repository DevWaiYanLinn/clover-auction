import { create } from "zustand";

interface PickAuctionState {
    id: number | undefined;
    pick: (id: number | undefined) => void;
}

const auctionStore = create<PickAuctionState>()((set) => ({
    id: undefined,
    pick: (id) => set((state) => ({ ...state, id: id })),
}));

export default auctionStore;
