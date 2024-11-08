/* eslint-disable react-hooks/exhaustive-deps */
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
import useSWR from "swr";
import { getAllAuctions } from "@/app/auction/actions";
import { AuctionTableType } from "@/types";
import { useSearchParams } from "next/navigation";

const AuctionTable = function () {
    const searchParams = useSearchParams();
    const { data } = useSWR<AuctionTableType[]>(
        ["auction-item", Object.fromEntries(searchParams.entries())],
        ([_, params]) => {
            return getAllAuctions(params as { [key: string]: string });
        },
    );

    const { id, pick } = auctionStore();

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
                                    {a.status === "OPEN" ? (
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
