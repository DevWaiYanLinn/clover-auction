import SwrProvider from "./swr-provider";
import { authenticatedUser } from "@/services/user/auth-service";
import { getAllCategories } from "@/services/user/category-service";
import React from "react";
export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await authenticatedUser();
    const categories = await getAllCategories();
    return (
        <SwrProvider
            prefetch={{
                "/api/auth/user": user,
                "/api/categories": categories,
            }}
        >
            {children}
        </SwrProvider>
    );
}
