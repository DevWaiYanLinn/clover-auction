"use client";
import { SWRConfig } from "swr";

const PreAuction = ({
    children,
    auctions,
}: {
    children: React.ReactNode;
    auctions: any;
}) => {
    return (
        <SWRConfig value={{ fallback: { "auction-item": auctions } }}>
            {children}
        </SWRConfig>
    );
};

export default PreAuction;
