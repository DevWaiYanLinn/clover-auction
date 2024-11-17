"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { fetchAPI } from "@/lib/fetch";
import { BidRecord } from "@/types";
import { Crown } from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function AuctionRanking() {
    const param = useParams();
    const { data: bids } = useSWR<BidRecord[]>(param.id, (id: string) =>
        fetchAPI(`/api/auctions/${id}/bids/ranking`),
    );

    return (
        <div className="flex-1 border rounded-md overflow-y-scroll relative">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[100px]">Bidder</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Previous Amount</TableHead>
                        <TableHead>Difference</TableHead>
                        <TableHead>Bid Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bids?.map((b, i) => {
                        return (
                            <TableRow key={b.id}>
                                <TableCell className="flex items-center">
                                    {i === 0 ? (
                                        <Crown
                                            size={20}
                                            className="mr-2"
                                            color="green"
                                        />
                                    ) : null}
                                    {b.username}
                                </TableCell>
                                <TableCell>${b.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    ${b.previousAmount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    ${b.difference.toFixed(2)}
                                </TableCell>
                                <TableCell>{b.bidTime}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
