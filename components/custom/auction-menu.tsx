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
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const AuctionMenu = () => {
    const params = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState(() => ({
        name: params.get("name") ?? "",
        status: params.get("status") ?? "",
    }));
    const onClickSearch = () => {
        const paramObj = Object.fromEntries(params.entries());

        if (search.name) {
            paramObj["name"] = search.name;
        }

        if (search.status) {
            paramObj["status"] = search.status;
        }

        router.push(
            "/auction/item?" + new URLSearchParams(paramObj).toString(),
        );
    };
    return (
        <div className="flex mt-3 items-end">
            <div className="flex-1 flex space-x-5 items-end">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="name"
                        id="email"
                        placeholder="Name"
                        onChange={(e) =>
                            setSearch({
                                ...search,
                                name: e.currentTarget.value,
                            })
                        }
                    />
                </div>
                <div>
                    <Label htmlFor="order">Status</Label>
                    <Select
                        onValueChange={(value) =>
                            setSearch({ ...search, status: value })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Auction Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All</SelectItem>
                            <SelectItem value="light">Open</SelectItem>
                            <SelectItem value="dark">Close</SelectItem>
                            <SelectItem value="system">Finished</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex-1 flex justify-end">
                <div>
                    <div className="text-center space-x-3">
                        <Link href={"/profile"} prefetch={false}>
                            <Button variant={"destructive"}>
                                <LogOut />
                                Exit
                            </Button>
                        </Link>
                        <Button onClick={onClickSearch}>
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
