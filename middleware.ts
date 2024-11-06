import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import appConfig from "@/config";

const publicRoutes = ["/"];
const authRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest, res: NextResponse) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get(appConfig.session.cookieName)?.value;
    const session = cookie && (await decrypt(cookie));
    const device = req.headers.get("User-Agent");
    const authenticated = session && session.device === device;

    if (!authenticated && !isPublicRoute && !authRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (authenticated && authRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/profile", req.nextUrl));
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
};
