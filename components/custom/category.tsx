/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { getAllCategories } from "@/app/category/actions";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryOnSubCategories, CategoryWithSubCategories } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import useSWR from "swr";

const Category = function () {
    const router = useRouter();

    const onPick = useCallback((id: number) => {
        router.push(`/auction?subcategory=${id}`, {});
    }, []);

    const { data } = useSWR<CategoryWithSubCategories[]>(
        "auction-category",
        () => getAllCategories(),
        {
            revalidateOnMount: false,
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
            revalidateIfStale: true,
        },
    );

    return (
        <div className="space-y-3 h-full overflow-y-scroll">
            <Accordion type="single" collapsible className="w-full p-2">
                {data?.map((category) => {
                    return (
                        <AccordionItem
                            key={category.id}
                            value={`item-${category.id}`}
                        >
                            <AccordionTrigger>{category.name}</AccordionTrigger>
                            {category.subcategories.map((s) => {
                                return (
                                    <AccordionContent
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPick(s.id);
                                        }}
                                        className="cursor-pointer"
                                        key={s.id}
                                    >
                                        {s.name}
                                    </AccordionContent>
                                );
                            })}
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default Category;
