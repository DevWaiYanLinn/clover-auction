"use client";
import { Button } from "../ui/button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ArrowRight } from "lucide-react";

export default function Banner() {
    return (
        <div className="flex h-[60vh] bg-white container p-5 justify-between items-center rounded-md">
            <div className="flex-1">
                <h2 className="font-bold text-4xl">
                    Welcome to{" "}
                    <span className=" italic text-green-500">Clover</span>
                </h2>
                <p className="mt-5 font-sans text-[1.2rem]">
                    Discover a world of unique items and unbeatable deals.
                    Whether you’re looking to buy or sell, our platform connects
                    you with a vibrant community of bidders and sellers. Join us
                    to explore exciting auctions, find hidden treasures, and
                    participate in a dynamic marketplace. Get started today and
                    experience the thrill of bidding!
                </p>
                <Button className="mt-5" size={"lg"}>
                    <span className="font-bold">More</span>
                    <ArrowRight />
                </Button>
            </div>
            <div className="flex-1 flex justify-end">
                <div className="overflow-hidden rounded-md">
                    <LazyLoadImage
                        className={"border"}
                        loading="lazy"
                        src={"/website.svg"}
                        width={400}
                        height={350}
                        alt="image"
                    />
                </div>
            </div>
        </div>
    );
}
