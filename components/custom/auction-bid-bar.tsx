"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import auctionStore from "@/store/auction-store";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { fetchAPI } from "@/lib/fetch";
import { getBidErrorMessage } from "@/lib/utils";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuctionTableData } from "@/types";

export default function AuctionBidBar() {
    const { auction } = auctionStore();
    const { mutate } = useSWRConfig();
    const searchParams = useSearchParams();

    const [pending, setPending] = useState(false);
    const disabled = !auction || pending;

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!auction) return;
        setPending(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const bidAmount = Number(formData.get("bid"));
        try {
            await fetchAPI(`/api/auctions/${auction.id}`, {
                method: "POST",
                body: JSON.stringify({
                    bidAmount,
                    itemId: auction.itemId,
                }),
            });

            toast.success("Your Bid Success");
            mutate(
                [
                    "/api/auctions",
                    new URLSearchParams(
                        Object.fromEntries(searchParams.entries()),
                    ).toString(),
                ],
                (data: AuctionTableData[] | undefined) => {
                    return data?.map((a) => {
                        if (a.id === auction.id) {
                            return { ...a, currentBid: bidAmount as any };
                        }
                        return a;
                    });
                },
                { revalidate: false },
            );
        } catch (error: any) {
            toast.error(getBidErrorMessage(error));
        } finally {
            form.reset();
            setPending(false);
        }
    };

    return (
        <div className="flex justify-between items-center mt-5 border rounded-md p-2">
            <div>
                <p className="italic text-md font-bold">
                    Copy Right©Clover Auction
                </p>
            </div>
            <form onSubmit={onSubmit} className="space-x-2 flex" method="POST">
                <div className="flex items-center space-x-2">
                    <Label>Bid</Label>
                    <Input name="bid" type="text" disabled={disabled} />
                </div>
                <div>
                    <Button size={"sm"} disabled={disabled}>
                        Bid
                    </Button>
                </div>
                <div>
                    <Button size={"sm"} disabled={disabled}>
                        Buyout
                    </Button>
                </div>
            </form>
        </div>
    );
}
