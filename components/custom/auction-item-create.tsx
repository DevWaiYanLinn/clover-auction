"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchAPI } from "@/lib/fetch";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AuctionItemCreate() {
    const param = useParams<{ id: string }>();
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();

    const [pending, setPending] = useState(false);

    const onAuctionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setPending(true);
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        try {
            await fetchAPI(`/api/items/${param.id}/auctions`, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });
            router.push("/item");
        } catch (error: any) {
            if (error.status === 422) {
                setErrors(error.info);
                return;
            }
            toast.error("Auction creating failed.");
        } finally {
            setPending(false);
        }
    };

    return (
        <form
            onSubmit={onAuctionSubmit}
            className="min-w-[500px] p-5 space-y-5 rounded-md shadow-md bg-white"
        >
            <h2 className="text-2xl font-medium">Create Auction</h2>
            <div className="flex space-x-5">
                <div className="flex-1">
                    <Label htmlFor="startingPrice">Staring Price</Label>
                    <Input
                        disabled={pending}
                        type="number"
                        name="startingPrice"
                        placeholder="100.00"
                    />
                    <div className="text-xs font-bold text-red-500">
                        {errors.startingPrice}
                    </div>
                </div>
                <div className="flex-1">
                    <Label htmlFor="endPrice">Buyout Price</Label>
                    <Input
                        disabled={pending}
                        type="number"
                        name="buyoutPrice"
                        placeholder="1000.00"
                    />
                    <div className="text-xs font-bold text-red-500">
                        {errors.buyoutPrice}
                    </div>
                </div>
            </div>
            <div className="flex space-x-5">
                <div className="flex-1">
                    <Label htmlFor="Start Time">Staring Date</Label>
                    <Input
                        disabled={pending}
                        type="date"
                        name="startTime"
                        placeholder="Pick Date"
                    />
                    <div className="text-xs font-bold text-red-500">
                        {errors.startTime}
                    </div>
                </div>
                <div className="flex-1">
                    <Label htmlFor="endTime">End Date</Label>
                    <Input
                        disabled={pending}
                        type="date"
                        name="endTime"
                        placeholder="Pick Date"
                    />
                    <div className="text-xs font-bold text-red-500">
                        {errors.endTime}
                    </div>
                </div>
            </div>
            <div>
                <Label htmlFor="description">Your message</Label>
                <Textarea
                    rows={8}
                    className="w-full"
                    name="description"
                    placeholder="Type your message here."
                    id="description"
                />
                <div className="text-xs font-bold text-red-500">
                    {errors.description}
                </div>
            </div>
            <Button disabled={pending} size={"lg"}>
                Submit
            </Button>
        </form>
    );
}
