"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut, Search } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const BidRecordMenu = () => {
    const router = useRouter();
    return (
        <div className="flex items-end">
            <div className="flex-1 flex space-x-5 items-end">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="name" id="email" placeholder="Name" />
                </div>
            </div>
            <div className="flex-1 flex justify-end">
                <div className="text-center space-x-3">
                    <Button>
                        <Search />
                        Search
                    </Button>
                    <Button
                        variant={"destructive"}
                        onClick={() => {
                            router.push("/auction");
                        }}
                    >
                        <LogOut />
                        Auction
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BidRecordMenu;
