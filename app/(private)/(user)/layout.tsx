import NavBar from "@/components/custom/nav-bar";
import { Clover } from "lucide-react";
import Link from "next/link";
import Image from "next/legacy/image";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-slate-50 h-screen flex flex-col p-5 space-y-5">
            <div className="flex px-5 shadow-sm rounded-md border-b bg-white justify-between items-center">
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
                <NavBar />
            </div>
            {children}
        </div>
    );
}
