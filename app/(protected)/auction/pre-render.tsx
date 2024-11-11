"use client";

import { CategoryWithSubCategories } from "@/types";
import React from "react";
import { SWRConfig } from "swr";

type props = {
    children: React.ReactNode;
    categories: CategoryWithSubCategories[];
};

export default function PreRender({ children, categories }: props) {
    return (
        <SWRConfig
            value={{
                fallback: {
                    "/api/categories": categories,
                },
                revalidateOnFocus: false,
                revalidateOnMount: true,
                revalidateOnReconnect: true,
                revalidateIfStale: true,
            }}
        >
            {children}
        </SWRConfig>
    );
}
