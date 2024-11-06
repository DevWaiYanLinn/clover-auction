import { getServerSession } from "@/lib/session";
import { SessionProvider } from "@/provider/session-provider";

export default async function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    return <SessionProvider authSession={session}>{children}</SessionProvider>;
}
