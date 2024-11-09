"use client";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const onDisMiss = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            router.back();
        }
    };
    return createPortal(
        <div
            onClick={onDisMiss}
            className="absolute z-[100] flex justify-center items-center left-0 right-0 bottom-0 top-0 bg-gray-500 bg-opacity-40"
        >
            {children}
        </div>,
        document.getElementById("modal-root")!,
    );
}
