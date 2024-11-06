"use client";
import { itemAuction } from "@/app/(user)/item/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import {
    ChangeEvent,
    useActionState,
    useCallback,
    useMemo,
    useState,
} from "react";

const initialState = {
    errors: {
        startingPrice: [],
        buyoutPrice: [],
        description: [],
        startTime: [],
        endTime: [],
        message: [],
    },
    success: undefined,
};

export default function AuctionItemCreate() {
    const param = useParams<{ id: string }>();
    const pathName = usePathname();
    const [form, setForm] = useState<{
        startingPrice: string;
        buyoutPrice: string;
        startTime: string;
        endTime: string;
        description: string;
    }>({
        startingPrice: "",
        buyoutPrice: "",
        startTime: "",
        endTime: "",
        description: "",
    });

    const onHandleInput = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    const auctionCreateWithItemId = useMemo(
        () => itemAuction.bind(null, Number(param.id), pathName),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const [state, action, pending] = useActionState(
        auctionCreateWithItemId,
        initialState,
    );

    return (
        <form
            action={action}
            className="min-w-[500px] p-5 space-y-5 rounded-md shadow-md bg-white"
        >
            <h2 className="text-2xl font-medium">Create Auction</h2>
            <div className="flex gap-5">
                <div className="flex-1">
                    <Label htmlFor="startingPrice">Staring Price</Label>
                    <Input
                        disabled={pending}
                        value={form.startingPrice}
                        type="number"
                        name="startingPrice"
                        placeholder="100.00"
                        onChange={onHandleInput}
                    />
                    <span className="text-xs font-bold text-red-500">
                        {state.errors.startingPrice}
                    </span>
                </div>
                <div className="flex-1">
                    <Label htmlFor="endPrice">Buyout Price</Label>
                    <Input
                        disabled={pending}
                        value={form.buyoutPrice}
                        type="number"
                        name="buyoutPrice"
                        placeholder="1000.00"
                        onChange={onHandleInput}
                    />
                    <span className="text-xs font-bold text-red-500">
                        {state.errors.buyoutPrice}
                    </span>
                </div>
            </div>
            <div className="flex gap-5">
                <div className="flex-1">
                    <Label htmlFor="Start Time">Staring Date</Label>
                    <Input
                        disabled={pending}
                        value={form.startTime}
                        type="date"
                        name="startTime"
                        placeholder="Pick Date"
                        onChange={onHandleInput}
                    />
                    <span className="text-xs font-bold text-red-500">
                        {state.errors.startTime}
                    </span>
                </div>
                <div className="flex-1">
                    <Label htmlFor="entTime">End Date</Label>
                    <Input
                        disabled={pending}
                        value={form.endTime}
                        type="date"
                        name="endTime"
                        placeholder="Pick Date"
                        onChange={onHandleInput}
                    />
                    <span className="text-xs font-bold text-red-500">
                        {state.errors.endTime}
                    </span>
                </div>
            </div>
            <div>
                <Label htmlFor="description">Your message</Label>
                <Textarea
                    value={form.description}
                    rows={8}
                    className="w-full"
                    name="description"
                    placeholder="Type your message here."
                    id="description"
                    onChange={onHandleInput}
                />
            </div>
            <Button disabled={pending} size={"lg"}>
                {pending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating ....
                    </>
                ) : (
                    "Submit"
                )}
            </Button>
        </form>
    );
}