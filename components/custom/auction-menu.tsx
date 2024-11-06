import React from "react";
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

const AuctionMenu = () => {
    return (
        <div className="flex mt-3 items-end">
            <div className="flex-1 flex space-x-5 items-end">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="name" id="email" placeholder="Name" />
                </div>
                <div>
                    <Label htmlFor="order">Status</Label>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Auction Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex-1 flex justify-end">
                <div>
                    <div className="text-center space-x-3">
                        <Link href={"/profile"}>
                            <Button variant={"destructive"}>
                                <LogOut />
                                Exit
                            </Button>
                        </Link>
                        <Button>
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
