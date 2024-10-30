import Category from "@/components/custom/category";
import AuctionMenu from "@/components/custom/auction-menu";
import { Button } from "@/components/ui/button";
import AuctionTable from "@/components/custom/auction-table";
import AuctionBidBar from "@/components/custom/auction-bid-bar";
import AuctionNav from "@/components/custom/auction-navbar";

export default async function Auction() {
    return (
        <div className=" h-screen bg-white flex justify-center p-3">
            <div className="rounded-md flex flex-col h-full w-full border p-5">
                <AuctionNav />
                <AuctionMenu />
                <div className="flex flex-1 mt-5 space-x-3 overflow-hidden">
                    <div className="min-w-[250px] flex flex-col border rounded-md px-2">
                        <div className="text-center py-2">
                            <Button size={"sm"}>Reset</Button>
                        </div>
                        <Category />
                    </div>
                    <div className="flex-1 border rounded-md overflow-y-scroll">
                        <AuctionTable />
                    </div>
                </div>
                <div className="flex justify-end mt-5">
                    <AuctionBidBar />
                </div>
            </div>
        </div>
    );
}
