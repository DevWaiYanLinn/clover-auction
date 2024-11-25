"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import auctionStore from "@/store/auction-store";
import useSWR, { mutate } from "swr";
import { AuctionJson, AuthUser, SocketBid } from "@/types";
import { useSearchParams } from "next/navigation";
import { AuctionStatus } from "@prisma/client";
import { memo, useCallback, useEffect, useState } from "react";
import { getAuctionStatus } from "@/lib/utils";
import { fetchAPI } from "@/lib/fetch";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import { socket } from "@/socket/socket-io";

const AuctionStatusTooltip = memo(
    ({
        startTime,
        endTime,
        status,
    }: {
        startTime: string;
        endTime: string;
        status: AuctionStatus;
    }) => {
        return (
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger>
                        <span
                            className={`${status === AuctionStatus.OPEN ? "text-green-600" : "text-red-500"} font-bold py-[0.2rem] px-2 bg-white rounded-2xl capitalize`}
                        >
                            {status.toLowerCase()}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="border border-slate-400 bg-white text-black">
                        {dayjs(startTime).format("LLL")} -{" "}
                        {dayjs(endTime).format("LLL")}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    },
);

AuctionStatusTooltip.displayName = "AuctionStatusTooltip";

const AuctionItemRow = ({
    auction: a,
    user,
}: {
    auction: AuctionJson;
    user: AuthUser | undefined;
}) => {
    const [auction, setAuction] = useState<AuctionJson>(a);
    useEffect(() => {
        function onBid({ auction }: SocketBid) {
            setAuction(() => ({
                ...Object.assign(a, { currentBid: auction.amount }),
            }));
        }
        function onBuyout({ auction, user }: SocketBid) {
            setAuction(() => ({
                ...Object.assign(a, {
                    currentBid: auction.amount,
                    userId: user.id,
                    buyout: true,
                    status: AuctionStatus.BUYOUT,
                }),
            }));
        }
        socket.on(`bid-${auction.id}`, onBid);
        socket.on(`buyout-${auction.id}`, onBuyout);
        return () => {
            socket.off(`bid-${auction.id}`, onBid);
            socket.off(`buyout-${auction.id}`, onBuyout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onAuctionPick = useCallback(
        (auction: AuctionJson) => {
            pick(auction);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    const { auction: pickAuction, pick } = auctionStore();
    return (
        <TableRow
            onClick={() => onAuctionPick(auction)}
            key={auction.id}
            className={`${pickAuction?.id === auction.id ? "!bg-primary/90 text-white" : "bg-inherit"} cursor-pointer`}
        >
            <TableCell>
                <Avatar>
                    <AvatarImage src={auction.item.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </TableCell>
            <TableCell className="font-medium">{auction.item.name}</TableCell>
            <TableCell
                className={`${
                    auction.item.seller.id === user?.id
                        ? "text-green-500 font-bold"
                        : null
                }`}
            >
                {auction.item.seller.name}
            </TableCell>
            <TableCell>${auction.startingPrice.toFixed(2)}</TableCell>
            <TableCell>${auction.buyoutPrice.toFixed(2)}</TableCell>
            <TableCell>${auction.currentBid.toFixed(2)}</TableCell>
            <TableCell>
                <AuctionStatusTooltip
                    status={auction.status}
                    startTime={auction.startTime}
                    endTime={auction.endTime}
                />
            </TableCell>
        </TableRow>
    );
};

const AuctionTable = function () {
    const searchParams = useSearchParams();

    const {
        data: auctions,
        isLoading,
        error,
    } = useSWR<AuctionJson[]>(
        ["/api/auctions", searchParams.toString()],
        ([url, paramsString]) => fetchAPI(`${url}?${paramsString}`),
        {
            revalidateOnReconnect: true,
            revalidateIfStale: true,
        },
    );

    const { data: user } = useSWR<AuthUser>(
        "/api/auth/user",
        (url: string) => fetchAPI(url),
        { revalidateOnMount: false },
    );

    useEffect(() => {
        let timeInterval;
        timeInterval = setInterval(async () => {
            await mutate(
                ["/api/auctions", searchParams.toString()],
                (data: AuctionJson[] | undefined) => {
                    return data?.map((auction) => {
                        const status = getAuctionStatus(
                            auction.startTime,
                            auction.endTime,
                            auction.buyout,
                        );
                        if (status !== auction.status) {
                            return {
                                ...Object.assign(auction, { status }),
                            };
                        }
                        return auction;
                    });
                },
                { revalidate: false },
            );
        }, 1000 * 60);
        return () => {
            clearInterval(timeInterval);
        };
    }, [searchParams]);
    return (
        <div className="flex-1 border rounded-md overflow-y-scroll">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="min-w-[100px]">Name</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Starting Price</TableHead>
                        <TableHead>Buyout Price</TableHead>
                        <TableHead>Current Bid</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading || error ? (
                        <TableRow>
                            <TableCell className="text-center p-5" colSpan={8}>
                                Loading
                            </TableCell>
                        </TableRow>
                    ) : (
                        auctions?.map((auction) => (
                            <AuctionItemRow
                                user={user}
                                auction={auction}
                                key={auction.id}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AuctionTable;
