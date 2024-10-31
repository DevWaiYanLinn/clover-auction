import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/React.js.svg";
import { Button } from "../ui/button";

export default function AuctionNav() {
    return (
        <div className="flex justify-between border-b pb-3">
            <h1 className="flex items-center space-x-2 text-2xl font-semibold">
                <Image src={Logo} width={50} height={50} alt="log" />
                <span>Clover Auction</span>
            </h1>
            <div className="flex space-x-2 items-center">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Button size={"sm"}>
                    <ChevronLeft /> Home
                </Button>
            </div>
        </div>
    );
}
