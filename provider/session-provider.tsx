"use client";
import { useCallback, useState } from "react";
import { SessionContext } from "@/provider/session-context";
import { Session } from "@/types";

export function SessionProvider({
    children,
    authSession,
}: {
    authSession: Session | null;
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<null | Session>(authSession);
    const updateSession = useCallback((data: Session) => {
        setSession(data);
    }, []);
    return (
        <SessionContext.Provider value={{ session, updateSession }}>
            {children}
        </SessionContext.Provider>
    );
}
