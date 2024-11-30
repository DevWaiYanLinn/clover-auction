import { type NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import { login } from "@/lib/session";
import { findOrCreateUser } from "@/services/user/user-service";
import { HttpError } from "@/lib/exception";

export async function GET(request: NextRequest, response: NextResponse) {
    const query = request.nextUrl.searchParams;

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_CLIENT_SECRET!,
        process.env.GOOGLE_CALLBACK_URL!,
    );

    try {
        const { tokens } = await oauth2Client.getToken(query.get("code")!);

        const res = await fetch(process.env.GOOGLE_USER_INFO_URL!, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            throw new HttpError({ status: 401 });
        }

        const info = await res.json();

        const user = await findOrCreateUser({
            email: info.email,
            data: { name: info.name, email: info.email, password: uuidv4() },
        });

        await login({ id: user.id });

        return Response.redirect(new URL("/profile", request.nextUrl));
    } catch (error) {
        return Response.redirect(new URL("/login", request.nextUrl));
    }
}
