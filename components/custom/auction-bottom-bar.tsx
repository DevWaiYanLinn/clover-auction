"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import auctionStore from "@/store/auction-store";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { fetchAPI } from "@/lib/fetch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuctionTableData, SocketBid } from "@/types";
import { socket } from "@/socket/socket-io";
import { AuctionStatus } from "@prisma/client";

export default function AuctionBottomBar() {
    const { auction, pick } = auctionStore();
    const { mutate } = useSWRConfig();
    const searchParams = useSearchParams();
    const [pending, setPending] = useState(false);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const disabled = !auction || pending;
    const [amount, setAmount] = useState("");
    const paramsString = useMemo(
        () =>
            new URLSearchParams(
                Object.fromEntries(searchParams.entries()),
            ).toString(),
        [searchParams],
    );

    const onBuyoutClick = async () => {
        if (!auction) return;
        setPending(true);
        try {
            await fetchAPI(`/api/auctions/${auction.id}/buyout`, {
                method: "POST",
            });

            toast.success("Buyout Success");
        } catch (error: any) {
            toast.error(error.info.message);
        } finally {
            pick(null);
            setAmount("");
            setPending(false);
        }
    };

    const mutateAuctionOnBid = useCallback(
        ({ user, auction }: SocketBid, buyout: boolean = false) => {
            mutate(
                ["/api/auctions", paramsString],
                (data: AuctionTableData[] | undefined) => {
                    return data?.map((a) => {
                        if (a.id === auction.id) {
                            return {
                                ...a,
                                status: buyout
                                    ? AuctionStatus.FINISHED
                                    : a.status,
                                userId: buyout ? user.id : null,
                                currentBid: auction.amount as any,
                                buyout,
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

    const mutateAuction = useCallback(() => {
        mutate(["/api/acutions", paramsString]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsString]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onReconnect() {
            mutateAuction();
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onBid(data: SocketBid) {
            mutateAuctionOnBid(data);
        }

        function onBuyout(data: SocketBid) {
            mutateAuctionOnBid(data, true);
        }

        socket.on("connect", onConnect);
        socket.on("reconnect", onReconnect);
        socket.on("disconnect", onDisconnect);
        socket.on("bid", onBid);
        socket.on("buyout", onBuyout);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("bid", onBid);
            socket.on("buyout", onBuyout);
            socket.off("reconnect", onReconnect);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBidClick = async () => {
        if (!auction) return;
        setPending(true);
        try {
            await fetchAPI(`/api/auctions/${auction.id}/bids`, {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(amount),
                }),
            });

            toast.success("Your Bid Success");
        } catch (error: any) {
            toast.error(error.info.message);
        } finally {
            pick(null);
            setAmount("");
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
                <div>
                    <Button
                        type="button"
                        onClick={onBidClick}
                        size={"sm"}
                        disabled={disabled}
                    >
                        Bid
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={onBuyoutClick}
                        size={"sm"}
                        disabled={disabled}
                    >
                        Buyout
                    </Button>
                </div>
            </div>
        </div>
    );
}
