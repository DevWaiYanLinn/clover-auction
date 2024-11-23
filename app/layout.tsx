import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import React from "react";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const RobotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
});
import "./globals.css";

export const metadata: Metadata = {
    title: "Clover Auction",
    description: "The best auction in town.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased ${RobotoMono.className}`}>
                <ToastContainer
                    position="top-center"
                    hideProgressBar={true}
                    transition={Bounce}
                    theme="colored"
                    autoClose={3000}
                />
                <div id="modal-root"></div>
                {children}
            </body>
        </html>
    );
}
