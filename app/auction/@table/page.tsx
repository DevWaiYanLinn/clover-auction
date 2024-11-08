import AuctionTable from "@/components/custom/auction-table";
import PreRenderAuction from "./pre-render-auction";
import { getAllAuctions } from "../actions";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const auctions = await getAllAuctions(params);
    return (
        <PreRenderAuction auctions={auctions}>
            <AuctionTable />
        </PreRenderAuction>
    );
}
