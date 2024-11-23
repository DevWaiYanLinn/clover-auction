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
import { UserBidJson } from "@/types";
import { memo } from "react";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { CircleDollarSign, RefreshCcw } from "lucide-react";
import dayjs from "@/lib/dayjs";

const UserBid = memo(() => {
    const {
        data: bids,
        isLoading,
        mutate,
    } = useSWR<UserBidJson[] | undefined>(
        "/api/user/bids",
        (url: string) => fetchAPI(url),
        { revalidateOnMount: false },
    );
    return (
        <Dialog
            onOpenChange={async (open) => {
                if (open) await mutate(undefined, { revalidate: true });
            }}
        >
            <DialogTrigger className="h-8 rounded-md px-3 text-xs inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90">
                <CircleDollarSign />
                Bids
            </DialogTrigger>
            <DialogContent className="min-w-[1200px] h-[600px]">
                <DialogHeader>
                    <DialogTitle>Bid Records</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mb-2">
                    <Button
                        disabled={isLoading}
                        onClick={() => mutate(undefined, { revalidate: true })}
                    >
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
                </Table>
            </DialogContent>
        </Dialog>
    );
});

UserBid.displayName = "UserBid";

export default UserBid;
