import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Coins, RefreshCcw } from "lucide-react";
import ItemCreateForm from "@/components/custom/item-create-form";
import { getItemPageData } from "./actions";

export default async function Page() {
    const { categories, items } = await getItemPageData();
    return (
        <div className="flex p-5 space-x-3">
            <ItemCreateForm categories={categories} />
            <div className="flex-1 bg-white rounded-md shadow-md p-5">
                <div className="flex justify-end mb-2">
                    <Button size={"sm"}>
                        <RefreshCcw />
                        Refresh
                    </Button>
                </div>
                <Table>
                    <TableCaption>A list of your recent items.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead className="w-[100px]">name</TableHead>
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
