import { AuctionTableType } from "@/types";
import type { Auction } from "@prisma/client";
import { create } from "zustand";

interface PickAuctionState {
    id: number | undefined;
    auctions: AuctionTableType[];
    pick: (id: number | undefined) => void;
    createAuction: (auctions: AuctionTableType[]) => void;
}

const auctionStore = create<PickAuctionState>()((set) => ({
    id: undefined,
    auctions: [],
    pick: (id) => set((state) => ({ ...state, id: id })),
    createAuction: (auctions: AuctionTableType[]) =>
        set((state) => ({ ...state, auctions })),
    updateBid: (auction: Auction) =>
        set((state) => {
            const auctions = state.auctions.map((a) => {
                if (a.id === auction.id) {
                    a.currentBid = auction.currentBid;
                }
                return a;
            });
            return { ...state, auctions };
        }),
}));

export default auctionStore;
