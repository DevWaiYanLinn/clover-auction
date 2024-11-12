import { getSession } from "@/lib/session";
import PreFetch from "./pre-fetch";
import { getAuthUser } from "@/services/user-service";
import { getAllCategories } from "@/services/category-service";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const user = await getAuthUser(session!.user.id);
    const categories = await getAllCategories();
    return (
        <PreFetch
            prefetch={{
                "/api/auth/users": user,
                "/api/categories": categories,
            }}
        >
            {children}
        </PreFetch>
    );
}
