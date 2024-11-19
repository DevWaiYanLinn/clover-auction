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
import { AuctionJson, AuthUser } from "@/types";
import { useSearchParams } from "next/navigation";
import { AuctionStatus } from "@prisma/client";
import { useEffect, useMemo } from "react";
import { getAuctionStatus } from "@/lib/utils";
import { fetchAPI } from "@/lib/fetch";
import { Button } from "../ui/button";
import { UsersRound } from "lucide-react";
import Link from "next/link";

const AuctionTable = function () {
    const searchParams = useSearchParams();
    const { auction, pick } = auctionStore();
    const paramsString = useMemo(
        () =>
            new URLSearchParams(
                Object.fromEntries(searchParams.entries()),
            ).toString(),
        [searchParams],
    );

    const { data: user } = useSWR<AuthUser>(
        "/api/auth/users",
        (url: string) => fetchAPI(url),
        { revalidateOnMount: false },
    );

    const { data } = useSWR<AuctionJson[]>(
        ["/api/auctions", paramsString],
        ([url, paramsString]) => fetchAPI(`${url}?${paramsString}`),
        {
            dedupingInterval: 1000 * 60,
            revalidateOnReconnect: true,
            revalidateIfStale: true,
        },
    );
    const onAuctionPick = (auction: AuctionJson) => {
        pick(auction);
    };
    useEffect(() => {
        let timeInterval;
        timeInterval = setInterval(() => {
            mutate(
                ["/api/auctions", paramsString],
                (data: AuctionJson[] | undefined) => {
                    return data?.map((a) => {
                        const status = a.userId
                            ? AuctionStatus.FINISHED
                            : getAuctionStatus(a.startTime, a.endTime);
                        if (status !== a.status) {
                            return {
                                ...a,
                                ...Object.assign(a, { status }),
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
    }, [paramsString]);

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
                        <TableHead className="text-right">Detail</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((a) => {
                        return (
                            <TableRow
                                onClick={() => onAuctionPick(a)}
                                key={a.id}
                                className={`${auction?.id === a.id ? "!bg-primary/90 text-white" : "bg-inherit"} cursor-pointer`}
                            >
                                <TableCell className="font-medium">
                                    {a.item.name}
                                </TableCell>
                                <TableCell className={`capitalize`}>
                                    <span
                                        className={`${a.status === AuctionStatus.OPEN ? "text-green-600" : "text-red-500"} font-bold py-[0.2rem] px-2 bg-white rounded-2xl`}
                                    >
                                        {a.status.toLowerCase()}
                                    </span>{" "}
                                    {a.buyout ? "(buyout)" : ""}
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
                                    ${a.startingPrice.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    ${a.buyoutPrice.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    ${a.currentBid.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right text-black bg-white">
                                    <Link
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
