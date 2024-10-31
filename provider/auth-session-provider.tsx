import { getServerSession } from "@/lib/session";
import { SessionProvider } from "@/provider/session-provider";

export default async function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    "use server";
    const session = await getServerSession();
    console.log(session);
    return <SessionProvider authSession={session}>{children}</SessionProvider>;
}
