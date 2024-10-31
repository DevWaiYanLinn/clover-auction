"use client";
import { useCallback, useState } from "react";
import { SessionContext } from "@/provider/session-context";
import { User } from "@/types";

export function SessionProvider({
    children,
    session,
}: {
    session: { user: User } | null;
    children: React.ReactNode;
}) {
    "use client";
    const [, setSession] = useState<null | { user: User }>(null);
    const updateSession = useCallback((data: User) => {
        setSession({ user: data });
    }, []);
    return (
        <SessionContext.Provider value={{ session, updateSession }}>
            {children}
        </SessionContext.Provider>
    );
}
