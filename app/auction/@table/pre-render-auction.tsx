"use client";
import { AuctionTableType } from "@/types";
import { SWRConfig } from "swr";

export default function PreRenderAuction({
    children,
    auctions,
}: {
    children: React.ReactNode;
    auctions: AuctionTableType;
}) {
    return (
        <SWRConfig value={{ fallback: { "auction-item": auctions } }}>
            {children}
        </SWRConfig>
    );
}
