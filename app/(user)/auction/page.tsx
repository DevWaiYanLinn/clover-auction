import Category from "@/components/custom/category";
import AuctionMenu from "@/components/custom/auction-menu";
import { Button } from "@/components/ui/button";
import AuctionTable from "@/components/custom/auction-table";
import AuctionBidBar from "@/components/custom/auction-bid-bar";
import AuctionNav from "@/components/custom/auction-navbar";
import { getAllCategories } from "@/app/(user)/auction/actions";

export default async function Auction() {
    const categories = await getAllCategories();
    return (
        <div className="flex-1 flex justify-center bg-slate-100 p-3 overflow-hidden">
            <div className="rounded-md bg-white flex flex-col h-full w-full border p-5">
                <AuctionMenu />
                <div className="flex flex-1 mt-5 space-x-3 overflow-hidden">
                    <div className="min-w-[300px] flex flex-col border rounded-md px-2">
                        <div className="text-center py-2">
                            <Button size={"lg"} variant={"destructive"}>
                                Reset
                            </Button>
                        </div>
                        <Category categories={categories} />
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
