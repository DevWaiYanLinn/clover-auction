import AuctionTable from "@/components/custom/auction-table";
import { getAllAuctions } from "../actions";
import PreAuction from "./pre-auction";

export default async function Auction({
    params = {},
}: {
    params?: { [key: string]: string | string[] | undefined };
}) {
    const auctions = await getAllAuctions(params);

    return (
        <PreAuction auctions={auctions}>
            <AuctionTable />
        </PreAuction>
    );
}
