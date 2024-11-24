import { Settings, Star, StarHalf } from "lucide-react";
import Image from "next/legacy/image";
import { Logout } from "@/app/(public)/logout/actions";
import { Button } from "@/components/ui/button";
import DonutChart from "@/components/chart/donut-chart";
import BarChartComponent from "@/components/chart/bar-chart-component";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex space-x-5">
            <div className="w-[280px] shadow-md bg-white rounded-lg flex flex-col space-y-5 p-5">
                <div className="space-y-1">
                    <div className="flex justify-center">
                        <div className="relative">
                            <Link
                                href={"/"}
                                className="size-8 hover:bg-slate-400 flex justify-center items-center z-50 absolute bg-slate-50 rounded-full bottom-3 right-2"
                            >
                                <Settings size={20} />
                            </Link>
                            <Image
                                width={200}
                                height={200}
                                objectFit="cover"
                                src={"/profile-default.jpeg"}
                                alt={"profile"}
                                className=" rounded-md bg-gray-300"
                            />
                        </div>
                    </div>
                    <h2 className="text-2xl text-left font-medium">Marry</h2>
                    <div className="text-slate-500 text-sm">(Buyer/Seller)</div>
                </div>
                <div>
                    <h2 className="border-b font-bold text-md text-slate-500  ">
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
                    <h2 className="border-b text-md font-bold text-slate-500">
                        Email
                    </h2>
                    <p className="mt-2">marry@123gmail.com</p>
                </div>
                <div>
                    <h2 className="border-b text-md font-bold text-slate-500">
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
