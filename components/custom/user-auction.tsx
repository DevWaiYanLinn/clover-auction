"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { fetchAPI } from "@/lib/fetch";
import { UserAuctionJson } from "@/types";
import { memo } from "react";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Box, RefreshCcw } from "lucide-react";
import dayjs from "@/lib/dayjs";

const UserBid = memo(() => {
    const {
        data: auctions,
        isLoading,
        mutate,
    } = useSWR<UserAuctionJson[] | undefined>(
        "/api/user/auctions",
        (url: string) => fetchAPI(url),
        { revalidateOnMount: false },
    );
    return (
        <Dialog
            onOpenChange={(open) => {
                if (open) void mutate();
            }}
        >
            <DialogTrigger className="h-8 rounded-md px-3 text-xs inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90">
                <Box />
                Auctions
            </DialogTrigger>
            <DialogContent className="min-w-[1200px] h-[600px]">
                <DialogHeader>
                    <DialogTitle>Auctions</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mb-2">
                    <Button disabled={isLoading} onClick={() => mutate()}>
                        <RefreshCcw />
                        Refresh
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Auction ID</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Current Bid</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell className="text-center" colSpan={6}>
                                    Loading
                                </TableCell>
                            </TableRow>
                        ) : (
                            auctions?.map((auction) => {
                                return (
                                    <TableRow key={auction.id}>
                                        <TableCell>{auction.id}</TableCell>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage
                                                    src={auction.item.imageUrl}
                                                />
                                                <AvatarFallback>
                                                    CN
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            {auction.item.name}
                                        </TableCell>
                                        <TableCell>
                                            ${auction.currentBid.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {dayjs(auction.endTime).format(
                                                "LLL",
                                            )}
                                        </TableCell>
                                        <TableCell>Pending</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
});

UserBid.displayName = "UserBid";

export default UserBid;
