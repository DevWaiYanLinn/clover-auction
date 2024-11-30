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
import { Box, Check, CirclePlus, RefreshCcw, X } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllItems } from "@/services/user/item-service";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const filters = await searchParams;
    const items = await getAllItems(filters);
    return (
        <div className="space-x-3 flex-1">
            <div className="h-full bg-white rounded-md shadow-md px-5">
                <div className="flex justify-end items-center space-x-2 mb-2 p-3 py-5">
                    <Link href={"/item"}>
                        <Button size={"sm"}>
                            <RefreshCcw />
                            Refresh
                        </Button>
                    </Link>
                    <Link href={"/item/create"} className="flex">
                        <Button size={"sm"}>
                            <CirclePlus />
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
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>SubCategory</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Auction</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.id}
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={item.imageUrl} />
                                        <AvatarFallback>IMG</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{item.category.name}</TableCell>
                                <TableCell>{item.subCategory.name}</TableCell>
                                <TableCell>
                                    {item.createdAt.toDateString()}
                                </TableCell>
                                <TableCell>
                                    {item.auction ? (
                                        <Check className="text-green-500" />
                                    ) : (
                                        <X className="text-red-500" />
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {!item.auction ? (
                                        <Link href={`/item/${item.id}/auction`}>
                                            <Button size={"sm"}>
                                                <Box />
                                                Auction
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled size={"sm"}>
                                            <Box />
                                            Auction
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
