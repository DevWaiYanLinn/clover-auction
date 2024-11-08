"use client";

import { CategoryWithSubCategories } from "@/types";
import { SWRConfig } from "swr";

export default function PreRenderCategory({
    children,
    categories,
}: {
    children: React.ReactNode;
    categories: CategoryWithSubCategories[];
}) {
    return (
        <SWRConfig
            value={{
                fallback: {
                    "auction-category": categories,
                },
            }}
        >
            {children}
        </SWRConfig>
    );
}
