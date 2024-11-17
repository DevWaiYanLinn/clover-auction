import { AuctionTableData } from "@/types";
import { create } from "zustand";

interface PickAuctionState {
    auction: AuctionTableData | null;
    pick: (auction: AuctionTableData | null) => void;
}

const auctionStore = create<PickAuctionState>()((set) => ({
    auction: null,
    pick: (auction) => set((state) => ({ auction })),
}));

export default auctionStore;
