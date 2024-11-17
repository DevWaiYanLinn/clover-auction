import { AuctionJson } from "@/types";
import { create } from "zustand";

interface PickAuctionState {
    auction: AuctionJson | null;
    pick: (auction: AuctionJson | null) => void;
}

const auctionStore = create<PickAuctionState>()((set) => ({
    auction: null,
    pick: (auction) => set((state) => ({ auction })),
}));

export default auctionStore;
