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
import { AuctionJson, AuthUser, SocketBidType } from "@/types";
import { useSearchParams } from "next/navigation";
import { AuctionStatus } from "@prisma/client";
import { memo, useEffect } from "react";
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
                            className={`${status === AuctionStatus.Open ? "text-green-600" : "text-red-500"} font-bold py-[0.2rem] px-2 bg-white rounded-2xl`}
                        >
                            {status}
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
    auction,
    user,
}: {
    auction: AuctionJson;
    user: AuthUser | undefined;
}) => {
    const searchParams = useSearchParams();
    const { auction: pickAuction, pick } = auctionStore();

    const mutateAuctionOnBid = (data: {
        [key in keyof AuctionJson]?: AuctionJson[key];
    }) => {
        void mutate(
            ["/api/auctions", searchParams.toString()],
            (auctions: AuctionJson[] | undefined) => {
                return auctions?.map((auction) => {
                    if (auction.id === data.id) {
                        return { ...auction, ...data };
                    }
                    return auction;
                });
            },
            { revalidate: false },
        );
    };

    useEffect(() => {
        function onBid({ auction }: SocketBidType) {
            mutateAuctionOnBid({ currentBid: auction.amount, id: auction.id });
        }
        function onBuyout({ auction, user }: SocketBidType) {
            mutateAuctionOnBid({
                id: auction.id,
                currentBid: auction.amount,
                userId: user.id,
                status: AuctionStatus.Buyout,
            });
        }
        socket.on(`bid-${auction.id}`, onBid);
        socket.on(`buyout-${auction.id}`, onBuyout);
        return () => {
            socket.off(`bid-${auction.id}`, onBid);
            socket.off(`buyout-${auction.id}`, onBuyout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TableRow
            onClick={() => pick(auction)}
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
    const { pick } = auctionStore();
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
            revalidateOnMount: true,
            revalidateIfStale: true,
        },
    );

    const { data: user } = useSWR<AuthUser>(
        "/api/auth/user",
        (url: string) => fetchAPI(url),
        { revalidateOnMount: false },
    );

    useEffect(() => {
        return () => {
            pick(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
