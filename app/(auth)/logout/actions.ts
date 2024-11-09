"use server";
import config from "@/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Logout() {
    const cookie = await cookies();
    cookie.delete(config.session.cookieName);
    redirect("/login");
}
