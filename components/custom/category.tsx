/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryOnSubCategories } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const Category = function ({
    categories,
}: {
    categories: CategoryOnSubCategories[];
}) {
    const router = useRouter();

    const [data] = useState(categories);

    const onPick = useCallback((id: number) => {
        router.push(`/auction/item?subcategory=${id}`, {});
    }, []);

    return (
        <div className="space-y-3 h-full overflow-y-scroll">
            <Accordion type="single" collapsible className="w-full p-2">
                {data.map((category) => {
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
