import Link from "next/link";
import React from "react";

export default function Layout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <>
            {modal}
            {children}
        </>
    );
}
