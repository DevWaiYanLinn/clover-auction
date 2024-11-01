import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { decrypt } from "@/lib/session";

const publicRoutes = ["/login", "/register", "/"];
const protectedRoutes = ["/auction"];
const authRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest, res: NextResponse) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const cookie = (await cookies()).get(
        process.env.SESSION_COOKIE_NAME!,
    )?.value;

    const session = !cookie ? null : await decrypt(cookie);

    if (!session && protectedRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (session && authRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/auction", req.nextUrl));
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
