import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/provider/auth-session-provider";
import { Roboto_Mono } from "next/font/google";
import React from "react";

const RobotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased ${RobotoMono.className}`}>
                <AuthProvider>
                    <div id="modal-root"></div>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
