import AuctionBottomBar from "@/components/custom/auction-bottom-bar";
import AuctionMenu from "@/components/custom/auction-menu";

export default function Layout({
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
                <div className="flex flex-1 mt-5 space-x-3 overflow-hidden">
                    <div className="max-w-[300px] w-full flex flex-col border rounded-md px-2">
                        {sidebar}
                    </div>
                    {table}
                </div>
                <AuctionBottomBar />
            </div>
        </div>
    );
}
