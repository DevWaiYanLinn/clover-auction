"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import auctionStore from "@/store/auction-store";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { fetchAPI } from "@/lib/fetch";
import { getBidErrorMessage } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { AuctionTableData } from "@/types";
import { socket } from "@/socket/socket-io";

export default function AuctionBidBar() {
    const { auction } = auctionStore();
    const { mutate } = useSWRConfig();
    const searchParams = useSearchParams();
    const tableSegment = useSelectedLayoutSegment("table");
    const [pending, setPending] = useState(false);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const disabled = !auction || pending;

    const onBid = useCallback(
        (bid: {
            user: { id: number };
            auction: { id: number; currentBid: number; itemId: Number };
        }) => {
            mutate(
                [
                    "/api/auctions",
                    new URLSearchParams(
                        Object.fromEntries(searchParams.entries()),
                    ).toString(),
                ],
                (data: AuctionTableData[] | undefined) => {
                    return data?.map((a) => {
                        if (a.id === bid.auction.id) {
                            return {
                                ...a,
                                currentBid: bid.auction.currentBid as any,
                            };
                        }
                        return a;
                    });
                },
                { revalidate: false },
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchParams],
    );

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("bid", onBid);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("bid", onBid);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            // await mutate(
            //     [
            //         "/api/auctions",
            //         new URLSearchParams(
            //             Object.fromEntries(searchParams.entries()),
            //         ).toString(),
            //     ],
            //     (data: AuctionTableData[] | undefined) => {
            //         return data?.map((a) => {
            //             if (a.id === auction.id) {
            //                 return { ...a, currentBid: bidAmount as any };
            //             }
            //             return a;
            //         });
            //     },
            //     { revalidate: false },
            // );
        } catch (error: any) {
            toast.error(getBidErrorMessage(error));
        } finally {
            form.reset();
            setPending(false);
        }
    };

    return (
        <div className="flex justify-between items-center mt-5 border rounded-md p-3">
            <div>
                <p className="italic text-md font-bold">
                    Copy Right©Clover Auction
                </p>
            </div>
            <form
                onSubmit={onSubmit}
                className={`space-x-3 flex ${tableSegment === "page$" ? "visible" : " invisible"}`}
                method="POST"
            >
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
