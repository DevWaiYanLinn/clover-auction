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
import { useCallback, useEffect } from "react";
import { getAuctionStatus } from "@/lib/utils";
import { fetchAPI } from "@/lib/fetch";
import { Button } from "../ui/button";
import { UsersRound } from "lucide-react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";

const AuctionTable = function () {
    const searchParams = useSearchParams();
    const { auction, pick } = auctionStore();

    const { data: user } = useSWR<AuthUser>(
        "/api/auth/user",
        (url: string) => fetchAPI(url),
        { revalidateOnMount: false },
    );

    const { data, isLoading, error } = useSWR<AuctionJson[]>(
        ["/api/auctions", searchParams.toString()],
        ([url, paramsString]) => fetchAPI(`${url}?${paramsString}`),
        {
            dedupingInterval: 1000 * 60,
            revalidateOnReconnect: true,
            revalidateIfStale: true,
        },
    );
    const onAuctionPick = useCallback(
        (auction: AuctionJson) => {
            pick(auction);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        let timeInterval;
        timeInterval = setInterval(async () => {
            await mutate(
                ["/api/auctions", searchParams.toString()],
                (data: AuctionJson[] | undefined) => {
                    return data?.map((a) => {
                        const status = getAuctionStatus(
                            a.startTime,
                            a.endTime,
                            a.buyout,
                        );
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
                        data?.map((a) => {
                            return (
                                <TableRow
                                    onClick={() => onAuctionPick(a)}
                                    key={a.id}
                                    className={`${auction?.id === a.id ? "!bg-primary/90 text-white" : "bg-inherit"} cursor-pointer`}
                                >
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage
                                                src={a.item.imageUrl}
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {a.item.name}
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
                                    <TableCell>
                                        <TooltipProvider delayDuration={300}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span
                                                        className={`${a.status === AuctionStatus.OPEN ? "text-green-600" : "text-red-500"} font-bold py-[0.2rem] px-2 bg-white rounded-2xl capitalize`}
                                                    >
                                                        {a.status.toLowerCase()}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className="border border-slate-400 bg-white text-black">
                                                    {dayjs(a.startTime).format(
                                                        "LLL",
                                                    )}{" "}
                                                    -{" "}
                                                    {dayjs(a.endTime).format(
                                                        "LLL",
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AuctionTable;
