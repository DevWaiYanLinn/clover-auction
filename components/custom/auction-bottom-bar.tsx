"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import auctionStore from "@/store/auction-store";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { fetchAPI } from "@/lib/fetch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuctionJson, AuthUser, SocketBid } from "@/types";
import { socket } from "@/socket/socket-io";
import { AuctionStatus } from "@prisma/client";
import UserBid from "./user-bid";
import { Box, Coins, HandCoins } from "lucide-react";

export default function AuctionBottomBar() {
    const { auction } = auctionStore();
    const { mutate } = useSWRConfig();
    const searchParams = useSearchParams();
    const [pending, setPending] = useState(false);
    const [isConnected, setIsConnected] = useState(socket.connected);
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
    const mutateAuctionOnBid = useCallback(
        (auction: {
            [key in keyof AuctionJson]?: AuctionJson[key];
        }) => {
            mutate(
                ["/api/auctions", searchParams.toString()],
                (data: AuctionJson[] | undefined) => {
                    return data?.map((a) => {
                        if (a.id === auction.id) {
                            return { ...a, ...Object.assign(a, auction) };
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

        function onBid({ auction }: SocketBid) {
            mutateAuctionOnBid({
                id: auction.id,
                currentBid: auction.amount,
            });
        }

        function onBuyout({ user, auction }: SocketBid) {
            mutateAuctionOnBid({
                id: auction.id,
                currentBid: auction.amount,
                userId: user.id,
                buyout: true,
                status: AuctionStatus.BUYOUT,
            });
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("bid", onBid);
        socket.on("buyout", onBuyout);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("bid", onBid);
            socket.on("buyout", onBuyout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

            toast.success("Your Bid Success");
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
                <Button size={"sm"}>
                    <Box />
                    Auctions
                </Button>
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
