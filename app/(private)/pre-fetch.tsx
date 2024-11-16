"use client";
import { SWRConfig } from "swr";
import React from "react";

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
                revalidateOnReconnect: false,
                revalidateOnFocus: false,
            }}
        >
            {children}
        </SWRConfig>
    );
}
