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
import { useActionState, useCallback, useState } from "react";
import type { SubCategory } from "@prisma/client";
import { createItem } from "@/app/(user)/item/actions";
import { Loader2 } from "lucide-react";

const initialState = {
    errors: {
        name: [""],
        subcategory: [""],
        description: [""],
        message: [""],
    },
};

export default function ItemCreateForm({
    categories,
}: {
    categories: CategoryOnSubCategories[];
}) {
    const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
    const [subCategory, setSubCategory] = useState<string | undefined>(
        undefined,
    );
    const [key, setKey] = useState(+new Date());

    const onCategoryChange = useCallback((id: string) => {
        const category = categories.find((c) => c.id === Number(id))!;
        setSubCategories(category.subcategories);
        setSubCategory(undefined);
        setKey(+new Date());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [state, action, pending] = useActionState(createItem, initialState);

    return (
        <div className="min-w-[400px] rounded-md shadow-md bg-white p-5">
            <h2 className="text-3xl font-bold">Create Item</h2>
            <form className="mt-3 space-y-3" action={action}>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                        />
                        <span className="text-red-500">
                            {state.errors.name}
                        </span>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="photo">Picture</Label>
                        <Input id="photo" type="file" name="photo" />
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <Label htmlFor="order">Category</Label>
                        <Select
                            value={undefined}
                            name="category"
                            onValueChange={onCategoryChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
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
                            <SelectContent>
                                {subcategories.map((c) => (
                                    <SelectItem key={c.id} value={`${c.id}`}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            <span className="text-red-500">
                                {state.errors.subcategory}
                            </span>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Your message</Label>
                    <Textarea
                        rows={8}
                        name="description"
                        placeholder="Type your message here."
                        id="description"
                    />
                    {state.errors.description}
                </div>
                <div>
                    <Button disabled={pending} size={"lg"}>
                        {pending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
