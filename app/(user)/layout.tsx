import Image from "next/image";
import Logo from "@/public/React.js.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Logout } from "@/app/(user)/actions";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-slate-100 h-screen">
            <div className="flex p-5 border-b bg-white justify-between items-center">
                <div>
                    <h1 className="flex items-center space-x-2 text-2xl font-semibold">
                        <Image src={Logo} width={50} height={50} alt="log" />
                        <span>Clover Auction</span>
                    </h1>
                </div>
                <ul className="flex space-x-5 justify-center items-center">
                    <li>
                        <Link className="font-medium text-lg" href={"/auction"}>
                            Bid
                        </Link>
                    </li>
                    <li>
                        <Link className="font-medium text-lg" href={"/auction"}>
                            Auction
                        </Link>
                    </li>
                    <li>
                        <Link className="text-lg font-medium " href={"/item"}>
                            Item
                        </Link>
                    </li>
                    <li className="flex items-center space-x-5">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </li>
                </ul>
            </div>
            {children}
        </div>
    );
}
