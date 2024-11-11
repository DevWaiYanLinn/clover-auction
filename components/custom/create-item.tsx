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
import { CategoryOnSubCategories } from "@/types";
import { useActionState, useCallback, useEffect, useState } from "react";
import type { SubCategory } from "@prisma/client";
import { createItem } from "@/app/(protected)/(user)/item/actions";
import { Loader2 } from "lucide-react";

const initialState = {
    errors: {
        name: [],
        subcategory: [],
        description: [],
        message: [],
        photo: [],
    },
    success: undefined,
};

export default function CreateItem({
    categories = [],
}: {
    categories?: CategoryOnSubCategories[];
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
    const [subCategory, setSubCategory] = useState<string | undefined>(
        undefined,
    );
    const [key, setKey] = useState(+new Date());
    const [state, action, pending] = useActionState(createItem, initialState);

    const onCategoryChange = useCallback((id: string) => {
        const category = categories.find((c) => c.id === Number(id))!;
        setSubCategories(category.subcategories);
        setSubCategory(undefined);
        setKey(+new Date());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-w-[400px] rounded-md shadow-md bg-white p-5">
            <h2 className="text-3xl font-bold">Create Item</h2>
            <form className="mt-3 space-y-3" action={action}>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => {
                                setName(e.currentTarget.value);
                            }}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            disabled={pending}
                        />
                        <span className="text-red-500 text-xs font-bold">
                            {state.errors.name}
                        </span>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="photo">Picture</Label>
                        <Input
                            id="photo"
                            type="file"
                            name="photo"
                            disabled={pending}
                        />
                        <span className="text-red-500 text-xs font-bold">
                            {state.errors.photo}
                        </span>
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
                            value={subCategory}
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
                            <span className="text-red-500 text-xs font-bold">
                                {state.errors.subcategory}
                            </span>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Your message</Label>
                    <Textarea
                        disabled={pending}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={8}
                        name="description"
                        placeholder="Type your message here."
                        id="description"
                    />
                    <span className="text-red-500 text-xs font-bold">
                        {state.errors.description}
                    </span>
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
