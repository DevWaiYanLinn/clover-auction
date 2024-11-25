"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import auctionStore from "@/store/auction-store";
import useSWR from "swr";
import { toast } from "react-toastify";
import { fetchAPI } from "@/lib/fetch";
import { useMemo, useState } from "react";
import { AuthUser } from "@/types";
import { AuctionStatus } from "@prisma/client";
import UserBid from "./user-bid";
import { Coins, HandCoins } from "lucide-react";
import UserAuction from "@/components/custom/user-auction";

export default function AuctionBottomBar() {
    const { auction } = auctionStore();
    const [pending, setPending] = useState(false);
    const [amount, setAmount] = useState("");

    const { data: user } = useSWR<AuthUser>(
        "/api/auth/user",
        (url: string) => fetchAPI(url),
        { revalidateOnMount: false },
    );

    const disabled = useMemo(
        () =>
            !auction ||
            pending ||
            auction.item.seller.id === user?.id ||
            auction.status !== AuctionStatus.OPEN,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [auction, pending],
    );

    const onBuyoutClick = async () => {
        setPending(true);
        try {
            await fetchAPI(`/api/auctions/${auction!.id}/buyout`, {
                method: "POST",
            });
            toast.success("Buyout Success");
        } catch (error: any) {
            toast.error(error.info.message);
        } finally {
            setAmount("");
            setPending(false);
        }
    };
    const onBidClick = async () => {
        setPending(true);
        try {
            await fetchAPI(`/api/auctions/${auction!.id}/bids`, {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(amount),
                }),
            });

            toast.success("Bid Success");
        } catch (error: any) {
            toast.error(error.info.message);
        } finally {
            setAmount("");
            setPending(false);
        }
    };

    return (
        <div className="flex justify-between items-center mt-5">
            <div className="flex space-x-3">
                <UserBid />
                <UserAuction />
            </div>
            <div className={`space-x-3 flex`}>
                <div className="flex items-center space-x-2">
                    <Label>Bid</Label>
                    <Input
                        name="amount"
                        type="number"
                        value={amount}
                        disabled={disabled}
                        onChange={(e) => setAmount(e.currentTarget.value)}
                    />
                </div>

                <Button
                    type="button"
                    onClick={onBidClick}
                    size={"sm"}
                    disabled={disabled}
                >
                    <HandCoins />
                    Bid
                </Button>
                <Button
                    type="button"
                    onClick={onBuyoutClick}
                    size={"sm"}
                    disabled={disabled}
                >
                    <Coins />
                    Buyout
                </Button>
            </div>
        </div>
    );
}
