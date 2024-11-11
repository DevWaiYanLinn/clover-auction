"use client";
import { AuthUser } from "@/types";
import { SWRConfig } from "swr";

export default function AuthProvider({
    children,
    user,
}: {
    children: React.ReactNode;
    user: AuthUser | null;
}) {
    return (
        <SWRConfig
            value={{
                fallback: {
                    "/api/auth/users": user,
                },
            }}
        >
            {children}
        </SWRConfig>
    );
}
