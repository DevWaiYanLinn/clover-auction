"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import auctionStore from "@/store/auction-store";
import { bidAuction } from "@/app/auction/actions";
import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import { AuctionTableType } from "@/types";
import { Bounce, toast } from "react-toastify";
const initialState = {
    data: null,
    success: false,
    errors: { message: "" },
};
export default function AuctionBidBar() {
    const { id } = auctionStore();
    const searchParams = useSearchParams();
    const { mutate } = useSWRConfig();
    const [state, action, pending] = useActionState(
        bidAuction.bind(null, Number(id)),
        initialState,
    );
    useEffect(() => {
        if (state.errors.message) {
            toast.error(state.errors.message, {
                position: "top-center",
                hideProgressBar: true,
                transition: Bounce,
                theme: "colored",
                autoClose: 1500,
            });
            return;
        }
        if (state.success) {
            mutate(
                ["auction-item", Object.fromEntries(searchParams.entries())],
                (data: AuctionTableType[] | undefined) => {
                    const auctions = data?.map((a) => {
                        if (a.id === state.data.id) {
                            return {
                                ...a,
                                currentBid: state.data.currentBid,
                            };
                        }
                        return a;
                    });
                    return auctions;
                },
                { revalidate: false },
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const disabled = id === undefined || pending;

    return (
        <div className="flex justify-between items-center mt-5 border rounded-md p-2">
            <div>
                <p className="italic text-md font-bold">
                    Copy Right©Clover Auction
                </p>
            </div>
            <form action={action} className="space-x-2 flex">
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
