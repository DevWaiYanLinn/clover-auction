"use client";
import { AuthUser } from "@/types";
import { SWRConfig } from "swr";

export default function PreFetch({
    children,
    prefetch,
}: {
    children: React.ReactNode;
    prefetch: { [key: string]: any };
}) {
    return (
        <SWRConfig
            value={{
                fallback: prefetch,
                revalidateOnMount: true,
                revalidateIfStale: false,
                revalidateOnReconnect: true,
                revalidateOnFocus: false,
            }}
        >
            {children}
        </SWRConfig>
    );
}
