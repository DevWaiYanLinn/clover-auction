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
import { AuctionTableData, AuthUser } from "@/types";
import { useSearchParams } from "next/navigation";
import { AuctionStatus } from "@prisma/client";
import { useEffect } from "react";
import { getAuctionStatus } from "@/lib/utils";
import { fetchAPI } from "@/lib/fetch";
import { Button } from "../ui/button";
import { UsersRound } from "lucide-react";
import Link from "next/link";

const AuctionTable = function () {
    const searchParams = useSearchParams();
    const { auction, pick } = auctionStore();

    const { data: user } = useSWR<AuthUser>(
        "/api/auth/users",
        (url: string) => fetchAPI(url),
        { revalidateOnMount: false },
    );

    const { data } = useSWR<AuctionTableData[]>(
        [
            "/api/auctions",
            new URLSearchParams(
                Object.fromEntries(searchParams.entries()),
            ).toString(),
        ],
        ([url, paramsString]) => fetchAPI(`${url}?${paramsString}`),
        {
            refreshInterval: 1000 * 60 * 3,
        },
    );

    const onPick = (auction: AuctionTableData) => {
        if (
            auction.item.seller.id === user?.id ||
            auction.status !== AuctionStatus.OPEN
        ) {
            return;
        }

        pick(auction);
    };

    useEffect(() => {
        let timeInterval;
        timeInterval = setInterval(() => {
            mutate(
                [
                    "/api/auctions",
                    new URLSearchParams(
                        Object.fromEntries(searchParams.entries()),
                    ).toString(),
                ],
                (data: AuctionTableData[] | undefined) => {
                    if (!data) {
                        return data;
                    }

                    return data.map((a) => {
                        const status = getAuctionStatus(a.startTime, a.endTime);
                        if (status !== a.status) {
                            return {
                                ...a,
                                status,
                            };
                        }
                        return a;
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
                        <TableHead className="min-w-[100px]">Item</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Starting Price</TableHead>
                        <TableHead>Buyout Price</TableHead>
                        <TableHead>Current Bid</TableHead>
                        <TableHead className="text-right">Bidder</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((a) => {
                        return (
                            <TableRow
                                onClick={() => onPick(a)}
                                key={a.id}
                                className={`${auction?.id === a.id ? "!bg-primary/90 text-white" : null} ${a.status === "OPEN" ? "cursor-pointer" : "cursor-default"}`}
                            >
                                <TableCell className="font-medium">
                                    {a.item.name}
                                </TableCell>
                                <TableCell
                                    className={`${a.status === AuctionStatus.OPEN ? "text-green-400" : "text-red-500"} font-bold capitalize`}
                                >
                                    {a.status.toLowerCase()}
                                </TableCell>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={a.item.imageUrl} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell
                                    className={`${
                                        a.item.seller.id === user?.id
                                            ? "text-green-500 font-bold"
                                            : null
                                    }`}
                                >
                                    {a.item.seller.name}
                                </TableCell>

                                <TableCell>
                                    ${Number(a.startingPrice).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    ${Number(a.buyoutPrice).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    ${Number(a.currentBid).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right text-black bg-white">
                                    <Link
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        href={`/auction/${a.id}/bid`}
                                        prefetch={false}
                                    >
                                        <Button>
                                            <UsersRound />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default AuctionTable;
