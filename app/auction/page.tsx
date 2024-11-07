import Category from "@/components/custom/category";
import AuctionMenu from "@/components/custom/auction-menu";
import AuctionTable from "@/components/custom/auction-table";
import AuctionBidBar from "@/components/custom/auction-bid-bar";
import { getAllAuctions } from "@/app/auction/actions";
import { getAllCategories } from "@/app/category/actions";


export default async function Auction() {
    const categories = await getAllCategories();
    const auctions = await getAllAuctions();
    return (
        <div className="rounded-md bg-white flex-1 flex flex-col w-full h-full overflow-hidden border shadow-md p-5">
            <AuctionMenu />
            <div className="flex flex-1 mt-5 space-x-3 overflow-hidden">
                <div className="max-w-[300px] w-full flex flex-col border rounded-md px-2">
                    <div className="flex justify-center items-center py-2">
                        <h2 className="font-medium text-xl">Filter</h2>
                        {/* <Button size={"sm"} variant={"destructive"}>
                            <RefreshCcw />
                            Reset
                        </Button> */}
                    </div>
                    <Category categories={categories} />
                </div>
                <div className="flex-1 border rounded-md overflow-y-scroll">
                    <AuctionTable auctions={auctions} />
                </div>
            </div>
            <AuctionBidBar />
        </div>
    );
}
