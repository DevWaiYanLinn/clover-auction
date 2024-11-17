import { type Auction } from "@prisma/client";
import { create } from "zustand";

interface PickAuctionState {
    auction: Auction | null;
    pick: (auction: Auction | null) => void;
}

const auctionStore = create<PickAuctionState>()((set) => ({
    auction: null,
    pick: (auction) => set((state) => ({ auction })),
}));

export default auctionStore;
