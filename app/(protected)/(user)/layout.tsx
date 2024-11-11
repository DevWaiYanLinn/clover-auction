import NavBar from "@/components/custom/nav-bar";
import { Clover } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-slate-50 h-screen flex flex-col p-5 space-y-5">
            <div className="flex py-4 px-5 rounded-md border-b bg-white justify-between items-center">
                <Link href={"/"}>
                    <h1 className="flex items-center space-x-2 text-xl font-semibold">
                        <Clover size={40} className="text-green-500" />
                        <span className="italic">Clover Auction</span>
                    </h1>
                </Link>
                <NavBar />
            </div>
            {children}
        </div>
    );
}
