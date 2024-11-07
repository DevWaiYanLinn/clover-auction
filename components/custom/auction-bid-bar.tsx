"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import auctionStore from "@/store/auction-store";
export default function AuctionBidBar() {
    const { id } = auctionStore();
    return (
        <div className="flex justify-between items-center mt-5 border rounded-md p-2">
            <div>
                <p className="italic text-md font-bold">
                    Copy Right©Clover Auction
                </p>
            </div>
            <div className="space-x-2 flex">
                <div className="flex items-center space-x-2">
                    <Label>Bid</Label>
                    <Input type="text" disabled={id === undefined} />
                </div>
                <div>
                    <Button size={"sm"} disabled={id === undefined}>
                        Bid
                    </Button>
                </div>
                <div>
                    <Button size={"sm"} disabled={id === undefined}>
                        Buyout
                    </Button>
                </div>
            </div>
        </div>
    );
}
