import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
export default function AuctionBidBar() {
    return (
        <div className="flex justify-between items-center mt-5">
            <div>
                <p className="italic text-md ">Copy Right©Clover Auction</p>
            </div>
            <div className="space-x-2 flex">
                <div className="flex items-center space-x-2">
                    <Label>Bid</Label>
                    <Input type="text" disabled />
                </div>
                <div>
                    <Button size={"sm"} disabled>
                        Bid
                    </Button>
                </div>
                <div>
                    <Button size={"sm"} disabled>
                        Buyout
                    </Button>
                </div>
            </div>
        </div>
    );
}
