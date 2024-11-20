"use client";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuctionStatus } from "@prisma/client";

const AuctionMenu = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState({
        name: searchParams.get("name") ?? "",
        status: searchParams.get("status") ?? "",
        date: searchParams.get("date") ?? "",
    });
    const onSearch = () => {
        const searchParamsObj: { [key: string]: any } = { ...search };
        for (let key in searchParamsObj) {
            if (!searchParamsObj[key] || searchParamsObj[key] === "0") {
                delete searchParamsObj[key];
            }
        }

        router.push(
            "/auction?" + new URLSearchParams(searchParamsObj).toString(),
        );
    };
    return (
        <div className="flex items-end">
            <div className="flex flex-1 space-x-5 items-end">
                <div className="min-w-[200px]">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="name"
                        value={search.name}
                        placeholder="Name"
                        onChange={(e) =>
                            setSearch({
                                ...search,
                                name: e.currentTarget.value,
                            })
                        }
                    />
                </div>
                <div className="min-w-[200px]">
                    <Label htmlFor="date">Min Date</Label>
                    <Input
                        type="date"
                        placeholder="From Start Date"
                        value={search.date}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                date: e.currentTarget.value,
                            });
                        }}
                    />
                </div>
                <div className="min-w-[200px]" title="not stable">
                    <Label htmlFor="order">Status</Label>
                    <Select
                        disabled
                        value={search.status}
                        onValueChange={(value) =>
                            setSearch({ ...search, status: value })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Auction Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"0"}>All</SelectItem>
                            {Object.values(AuctionStatus).map((v) => (
                                <SelectItem
                                    className="capitalize"
                                    key={v}
                                    value={v}
                                >
                                    {v.toLocaleLowerCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={onSearch}>
                    <Search />
                    Search
                </Button>
            </div>
            <div className="flex justify-end">
                <div>
                    <div className="text-center space-x-3">
                        <Button>
                            <RefreshCcw />
                            Reset
                        </Button>
                        <Button
                            variant={"destructive"}
                            onClick={() => {
                                router.push("/profile");
                            }}
                        >
                            <LogOut />
                            Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionMenu;
