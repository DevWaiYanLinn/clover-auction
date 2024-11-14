"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { useCallback, useState } from "react";
import type { SubCategory } from "@prisma/client";
import { CategoryWithSubCategories } from "@/types";
import { fetchAPI } from "@/lib/fetch";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateItem({
    categories = [],
}: {
    categories?: CategoryWithSubCategories[];
}) {
    const router = useRouter();
    const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
    const [subcategory, setSubCategory] = useState<string | undefined>(
        undefined,
    );
    const [key, setKey] = useState(+new Date());
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const onCategoryChange = useCallback((id: string) => {
        const category = categories.find((c) => c.id === Number(id))!;
        setSubCategories(category.subcategories);
        setSubCategory(undefined);
        setKey(+new Date());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        try {
            await fetchAPI("/api/items", {
                method: "POST",
                body: formData,
            });
            router.push("/item");
        } catch (error: any) {
            if (error.status === 422) {
                setErrors(error.info);
                return;
            }
            toast.error("Item creating failed");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="min-w-[400px] rounded-md shadow-md bg-white p-5">
            <h2 className="text-3xl font-bold">Create Item</h2>
            <form onSubmit={onItemSubmit} className="mt-3 space-y-3">
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            disabled={pending}
                        />
                        <div className="text-red-500 text-xs font-bold">
                            {errors.name}
                        </div>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="photo">Picture</Label>
                        <Input
                            id="photo"
                            type="file"
                            name="photo"
                            disabled={pending}
                        />
                        <div className="text-red-500 text-xs font-bold">
                            {errors.photo?.[0]}
                        </div>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <Label htmlFor="order">Category</Label>
                        <Select
                            disabled={pending}
                            value={undefined}
                            name="category"
                            onValueChange={onCategoryChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="z-[999]">
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={`${c.id}`}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="subcategory">SubCategory</Label>
                        <Select
                            disabled={pending}
                            onValueChange={(value) => {
                                setSubCategory(value);
                            }}
                            value={subcategory}
                            key={key}
                            name="subcategory"
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Subcategory" />
                            </SelectTrigger>

                            <SelectContent className="z-[999]">
                                {subcategories.map((c) => (
                                    <SelectItem key={c.id} value={`${c.id}`}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            <div className="text-red-500 text-xs font-bold">
                                {errors.subcategory}
                            </div>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Your message</Label>
                    <Textarea
                        disabled={pending}
                        rows={8}
                        name="description"
                        placeholder="Type your message here."
                        id="description"
                    />
                    <div className="text-red-500 text-xs font-bold">
                        {errors.description}
                    </div>
                </div>
                <div>
                    <Button disabled={pending} size={"lg"}>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
