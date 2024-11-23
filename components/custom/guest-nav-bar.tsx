"use client";
import { Clover, House, KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/legacy/image";

export default function GuestNavBar() {
    return (
        <div className="flex shadow-sm px-5 rounded-md border-b justify-between items-center">
            <div className="container flex justify-between items-center">
                <Link href={"/"}>
                    <h1 className="flex items-center space-x-2 text-xl font-semibold">
                        <Image
                            src={"/clover.svg"}
                            width={140}
                            height={80}
                            alt={"logo"}
                        />
                    </h1>
                </Link>
                <div>
                    <Link href={"/login"} prefetch={true}>
                        <Button size={"lg"}>
                            <KeyRound />
                            Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
