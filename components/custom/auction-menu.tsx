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
import { LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuctionStatus } from "@prisma/client";

const AuctionMenu = () => {
    const tableSegment = useSelectedLayoutSegment("table");
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState(() => ({
        name: searchParams.get("name") ?? "",
        status: searchParams.get("status") ?? "",
    }));
    const onSearch = () => {
        const paramsObj = Object.fromEntries(searchParams.entries());
        paramsObj.name = search.name;
        paramsObj.status = search.status;

        for (let key in paramsObj) {
            if (!paramsObj[key] || paramsObj[key] === "0") {
                delete paramsObj[key];
            }
        }

        router.push("/auction?" + new URLSearchParams(paramsObj).toString());
    };
    return (
        <div className="flex mt-3 items-end">
            <div className="flex-1 flex space-x-5 items-end">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="name"
                        id="email"
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
                <div title="not stable">
                    <Label htmlFor="order">Status</Label>
                    <Select
                        disabled
                        value={search.status}
                        onValueChange={(value) =>
                            setSearch({ ...search, status: value })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
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
            </div>
            <div className="flex-1 flex justify-end">
                <div>
                    <div className="text-center space-x-3">
                        {tableSegment === "page$" ? (
                            <Link href={"/profile"} prefetch={false}>
                                <Button variant={"destructive"}>
                                    <LogOut />
                                    Exit
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                variant={"destructive"}
                                onClick={() => {
                                    router.back();
                                }}
                            >
                                <LogOut />
                                Back
                            </Button>
                        )}
                        <Button onClick={onSearch}>
                            <Search />
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionMenu;
