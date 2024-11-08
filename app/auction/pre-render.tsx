"use client";

import { AuctionTableType, CategoryWithSubCategories } from "@/types";
import React from "react";
import { SWRConfig } from "swr";

type props = {
    children: React.ReactNode;
    categories: CategoryWithSubCategories[];
    auctions: AuctionTableType[];
};

export default function PreRender({ children, categories, auctions }: props) {
    return (
        <SWRConfig
            value={{
                fallback: {
                    "auction-category": categories,
                },
                revalidateOnFocus: false,
                revalidateOnMount: true,
                revalidateOnReconnect: true,
                revalidateIfStale: true,
            }}
        >
            {children}
        </SWRConfig>
    );
}
