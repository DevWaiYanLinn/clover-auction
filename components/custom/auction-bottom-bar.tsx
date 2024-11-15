"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import auctionStore from "@/store/auction-store";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { fetchAPI } from "@/lib/fetch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { AuctionTableData, SocketBid } from "@/types";
import { socket } from "@/socket/socket-io";

export default function AuctionBottomBar() {
    const { auction } = auctionStore();
    const { mutate } = useSWRConfig();
    const searchParams = useSearchParams();
    const tableSegment = useSelectedLayoutSegment("table");
    const [pending, setPending] = useState(false);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const disabled = !auction || pending;
    const paramsString = useMemo(
        () =>
            new URLSearchParams(
                Object.fromEntries(searchParams.entries()),
            ).toString(),
        [searchParams],
    );

    const getBidErrorMessage = useCallback((error: any): string => {
        const errorMessages: {
            [key: number]: string | ((info: any) => string);
        } = {
            422: (info) => info.bidAmount || "Validation error occurred.",
            409: "Bid conflict: Someone already bid, try again.",
            403: "Auction is not opening or may be finished.",
            401: "Session has expired.",
        };

        if (errorMessages[error.status]) {
            const message = errorMessages[error.status];
            return typeof message === "function"
                ? message(error.info)
                : message;
        }

        return "Unknown Error";
    }, []);

    const mutateBid = useCallback(
        (auction: { id: number; currentBid: Number }) => {
            mutate(
                ["/api/auctions", paramsString],
                (data: AuctionTableData[] | undefined) => {
                    return data?.map((a) => {
                        if (a.id === auction.id) {
                            return {
                                ...a,
                                currentBid: auction.currentBid as any,
                            };
                        }
                        return a;
                    });
                },
                { revalidate: false },
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [paramsString],
    );

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onReconnect() {
            // mutate(["/api/auctions", paramsString]);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onBid(bid: SocketBid) {
            mutateBid({
                id: bid.auction.id,
                currentBid: bid.auction.currentBid,
            });
        }

        socket.on("connect", onConnect);
        socket.on("reconnect", onReconnect);
        socket.on("disconnect", onDisconnect);
        socket.on("bid", onBid);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("bid", onBid);
            socket.off("reconnect", onReconnect);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBidSumit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!auction) return;
        setPending(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const bidAmount = Number(formData.get("bid"));
        try {
            await fetchAPI(`/api/auctions/${auction.id}/bids`, {
                method: "POST",
                body: JSON.stringify({
                    bidAmount,
                }),
            });

            toast.success("Your Bid Success");
        } catch (error: any) {
            if (error.staus === 403) {
                mutate(["/api/auctions", paramsString]);
            }
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
                onSubmit={onBidSumit}
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
