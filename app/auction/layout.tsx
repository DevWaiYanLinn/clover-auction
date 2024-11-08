import AuctionBidBar from "@/components/custom/auction-bid-bar";
import AuctionMenu from "@/components/custom/auction-menu";

export default async function Layout({
    children,
    sidebar,
    table,
}: Readonly<{
    table: React.ReactNode;
    children: React.ReactNode;
    sidebar: React.ReactNode;
}>) {
    return (
        <div className="p-5 bg-slate-50 h-screen flex flex-col">
            <div className="rounded-md bg-white flex-1 flex flex-col w-full h-full overflow-hidden border shadow-md p-5">
                <AuctionMenu />
                {children}
                <div className="flex flex-1 mt-5 space-x-3 overflow-hidden">
                    <div className="max-w-[300px] w-full flex flex-col border rounded-md px-2">
                        <div className="flex justify-center items-center py-2">
                            <h2 className="font-medium text-xl">Filter</h2>
                        </div>
                        {sidebar}
                    </div>
                    {table}
                </div>
                <AuctionBidBar />
            </div>
        </div>
    );
}
