import { getSession } from "@/lib/session";
import AuthProvider from "./auth-provider";
import { getAuthUser } from "@/services/user-service";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const user = await getAuthUser(session!.user.id);

    return <AuthProvider user={user}>{children}</AuthProvider>;
}
