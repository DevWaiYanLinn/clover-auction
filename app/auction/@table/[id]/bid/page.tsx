import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import prisma from "@/database/prisma";
import { BidRecord, ParamsPromise } from "@/types";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: ParamsPromise }) {
    const id = (await params).id;
    const query: any = Prisma.sql`
    SELECT 
        b.id,
        b.bid_time as bidTime,
        b.amount,
        LAG(b.amount) OVER (ORDER BY b.bid_time) AS previousAmount,
        b.amount - LAG(b.amount) OVER (ORDER BY b.bid_time) AS difference,
        u.id AS userId,
        u.name as username
    FROM bids b
    JOIN users u ON b.user_id = u.id
    WHERE b.auction_id = ?
    ORDER BY b.bid_time;
`;
    query.values = [3];

    const bids = await prisma.$queryRaw<BidRecord[]>(query);

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
                    {bids.map((b) => {
                        return (
                            <TableRow key={b.id}>
                                <TableCell>{b.username}</TableCell>
                                <TableCell>
                                    ${Number(b.amount).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    ${Number(b.previousAmount).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    ${Number(b.difference).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {b.bidTime.toDateString()}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
