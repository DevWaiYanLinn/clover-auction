import { auth } from "@/lib/session";
import SwrProvider from "./swr-provider";
import { getUserById } from "@/services/user-service";
import { getAllCategories } from "@/services/category-service";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = await getUserById(session!.user.id);
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
