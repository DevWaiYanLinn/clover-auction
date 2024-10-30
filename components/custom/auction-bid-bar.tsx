import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
export default function AuctionBidBar() {
    return (
        <div className="flex space-x-2">
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
    );
}
