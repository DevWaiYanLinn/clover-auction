import { Settings, Star, StarHalf } from "lucide-react";
import Image from "next/legacy/image";
import { Logout } from "@/app/(auth)/logout/actions";
import { Button } from "@/components/ui/button";
import Logo from "@/public/React.js.svg";
import DonutChart from "@/components/chart/donut-chart";
import BarChartComponent from "@/components/chart/bar-chart-component";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex space-x-5">
            <div className="max-w-[400px] shadow-md bg-white rounded-lg flex flex-col space-y-5 p-5">
                <div className="space-y-3 flex flex-col items-center">
                    <div className="relative">
                        <Link
                            href={""}
                            className="size-8 hover:bg-slate-400 flex justify-center items-center z-50 absolute bg-slate-50 rounded-full bottom-3 right-2"
                        >
                            <Settings size={20} />
                        </Link>
                        <Image
                            width={200}
                            height={200}
                            objectFit="contain"
                            src={
                                "data:image/jpeg;base64,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"
                            }
                            alt={"profile"}
                            className=" rounded-md bg-gray-300"
                        />
                    </div>
                    <h2 className="text-3xl text-center font-medium">
                        Marry{" "}
                        <span className="text-slate-500 text-sm">
                            (Buyer/Seller)
                        </span>{" "}
                    </h2>
                </div>
                <div>
                    <h2 className="border-b font-bold text-lg text-slate-500  ">
                        Reputation
                    </h2>
                    <div className="flex mt-3 space-x-3 items-center">
                        <div>8.6</div>
                        <div className="flex space-x-1">
                            <Star />
                            <Star />
                            <Star />
                            <Star />
                            <StarHalf />
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="border-b text-lg font-bold text-slate-500">
                        Email
                    </h2>
                    <p className="mt-2">marry@123gmail.com</p>
                </div>
                <div>
                    <h2 className="border-b text-lg font-bold text-slate-500">
                        Phone Number
                    </h2>
                    <p className="mt-2">+66 953531753</p>
                </div>
                <div>
                    <form action={Logout}>
                        <Button size={"lg"} variant="destructive">
                            Logout
                        </Button>
                    </form>
                </div>
            </div>
            <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <DonutChart />
                    </div>
                    <div>
                        <BarChartComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}
