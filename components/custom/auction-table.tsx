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
import { Lock, LockOpen } from "lucide-react";
import useSWR, { mutate } from "swr";
import { AuctionTableData } from "@/types";
import { useSearchParams } from "next/navigation";
import { AuctionStatus } from "@prisma/client";
import { useEffect } from "react";
import { getAuctionStatus } from "@/lib/utils";
import { fetchAPI } from "@/lib/fetch";

const AuctionTable = function () {
    const searchParams = useSearchParams();
    const { id, pick } = auctionStore();
    const { data } = useSWR<AuctionTableData[]>(
        [
            "/auction/actions",
            new URLSearchParams(
                Object.fromEntries(searchParams.entries()),
            ).toString(),
        ],
        ([url, paramsString]) => {
            return fetchAPI(`${url}?${paramsString}`);
        },
        {
            refreshInterval: 1000 * 60,
        },
    );

    useEffect(() => {
        let timeInterval;
        timeInterval = setInterval(() => {
            mutate(
                [
                    "/auction/actions",
                    ,
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
                        <TableHead className="text-right">
                            Current Bid
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((a) => {
                        return (
                            <TableRow
                                onClick={() => {
                                    if (a.status === "OPEN") {
                                        pick(a.id);
                                    }
                                }}
                                data-id={a.id}
                                key={a.id}
                                className={`${id === a.id ? "!bg-primary/90 !text-white" : null} ${a.status === "OPEN" ? "cursor-pointer" : "cursor-default"}`}
                            >
                                <TableCell className="font-medium">
                                    {a.item.name}
                                </TableCell>
                                <TableCell>
                                    {a.status === AuctionStatus.OPEN ? (
                                        <LockOpen className="text-green-400" />
                                    ) : (
                                        <Lock className="text-red-400" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={a.item.imageUrl} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{a.item.seller.name}</TableCell>

                                <TableCell>
                                    ${Number(a.startingPrice).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    ${Number(a.buyoutPrice).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    ${Number(a.currentBid).toFixed(2)}
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
