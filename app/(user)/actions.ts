"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function Logout() {
    const cookie = await cookies();
    cookie.delete("clover-auction-house");
    redirect("/login");
}
