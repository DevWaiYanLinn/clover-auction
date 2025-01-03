import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/session";

const publicRoutes = ["/", "/verify"];
const authRoutes = [
    "/login",
    "/register",
    "/auth/google",
    "/auth/google/callback",
];

export default async function middleware(req: NextRequest, res: NextResponse) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);

    const session = await auth();
    const device = req.headers.get("User-Agent");
    const authenticated = session && session.device === device;
    req.headers.set("x-session", JSON.stringify(session));

    if (!authenticated && !isPublicRoute && !authRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (authenticated && authRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/profile", req.nextUrl));
    }

    return NextResponse.next({
        request: {
            headers: req.headers,
        },
    });
}
export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
};
