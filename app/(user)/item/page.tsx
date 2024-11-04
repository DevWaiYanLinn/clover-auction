import React from "react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CirclePlus, Coins, RefreshCcw } from "lucide-react";
import { getAllItem } from "./actions";
import Link from "next/link";

export default async function Page() {
    const items = await getAllItem();
    return (
        <div className="p-3 space-x-3 flex-1">
            <div className="h-full bg-white rounded-md shadow-md p-5">
                <div className="flex justify-end items-center space-x-2 mb-2">
                    <Button size={"sm"} variant={"destructive"}>
                        <CirclePlus className="mr-2" />
                        Refresh
                    </Button>
                    <Link href={"/item/create"} className="flex">
                        <Button size={"sm"}>
                            <RefreshCcw />
                            Add
                        </Button>
                    </Link>
                </div>
                <Table>
                    <TableCaption>A list of your recent items.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead className="min-w-[100px]">
                                Name
                            </TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>SubCategory</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                                Auction
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.id}
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category.name}</TableCell>
                                <TableCell>{item.subCategory.name}</TableCell>
                                <TableCell>
                                    {item.createdAt.toDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size={"sm"}>
                                        <Coins />
                                        Auction
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
