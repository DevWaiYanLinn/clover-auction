import { getSession } from "@/lib/session";
import PreFetch from "./pre-fetch";
import { getAuthUser } from "@/services/user-service";
import { getAllCategories } from "@/services/category-service";
import { Logout } from "../(public)/logout/actions";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const user = await getAuthUser(session!.user.id);
    if (!user) {
        await Logout();
        return redirect("/login");
    }
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
