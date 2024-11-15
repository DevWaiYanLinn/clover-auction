import { getSession } from "@/lib/session";

export default async function AuthSession({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    return <>{children}</>;
}
