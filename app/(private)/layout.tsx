import { auth } from "@/lib/session";
import PreFetch from "./pre-fetch";
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
