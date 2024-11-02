import { Star, StarHalf } from "lucide-react";
import Image from "next/legacy/image";
import { Logout } from "@/app/(user)/actions";
import { Button } from "@/components/ui/button";
import Logo from "@/public/React.js.svg";
import DonutChart from "@/components/chart/donut-chart";
import BarChartComponent from "@/components/chart/bar-chart-component";

export default function Page() {
    return (
        <div className="flex p-5 space-x-5">
            <div className="max-w-[400px] shadow-md bg-white rounded-lg flex flex-col space-y-5 p-10">
                <div className="space-y-3 flex flex-col items-center">
                    <Image
                        width={220}
                        height={220}
                        src={Logo}
                        alt={"profile"}
                        className=" rounded-md bg-gray-300"
                    />
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
