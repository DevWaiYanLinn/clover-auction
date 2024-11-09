"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();

    return (
        <ul className="flex space-x-6 justify-center items-center">
            <li
                className={`py-2 border-b-[5px] ${pathname === "/profile" ? "border-primary" : "border-transparent"}`}
            >
                <Link
                    prefetch
                    className="font-medium text-lg"
                    href={"/profile"}
                >
                    Profile
                </Link>
            </li>
            <li
                className={`py-2 border-b-[5px] ${pathname === "/bid" ? "border-primary" : "border-transparent"}`}
            >
                <Link
                    prefetch
                    className="font-medium text-lg"
                    href={"/auction"}
                >
                    Bid
                </Link>
            </li>
            <li
                className={`py-2 border-b-[5px] ${pathname === "/auction" ? "border-primary" : "border-transparent"}`}
            >
                <Link
                    prefetch
                    className="font-medium text-lg"
                    href={"/auction"}
                >
                    Auction
                </Link>
            </li>
            <li
                className={`py-2 border-b-[5px] ${pathname === "/item" ? "border-primary" : "border-transparent"}`}
            >
                <Link prefetch className="text-lg font-medium " href={"/item"}>
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
    );
}
