"use client";
import { Clover, House, KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useContext } from "react";
import { SessionContext } from "@/provider/session-context";

export default function GuestNavBar() {
    const { session } = useContext(SessionContext);
    return (
        <div className="flex  shadow-sm py-4 px-5 rounded-md border-b justify-between items-center">
            <div className="container flex justify-between items-center">
                <Link href={"/"}>
                    <h1 className="flex items-center space-x-2 text-xl font-semibold">
                        <Clover size={40} className="text-green-500" />
                        <span className="italic">Clover Auction</span>
                    </h1>
                </Link>
                <div>
                    {session ? (
                        <Link href={"/profile"} prefetch={true}>
                            <Button size={"lg"}>
                                <House />
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link href={"/login"} prefetch={true}>
                            <Button size={"lg"}>
                                <KeyRound />
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
