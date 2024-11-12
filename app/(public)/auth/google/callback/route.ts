import { type NextRequest } from "next/server";
import { google } from "googleapis";
import prisma from "@/database/prisma";
import { hash } from "@/lib/bcrypt";
import { v4 as uuidv4 } from "uuid";
import { login } from "@/lib/session";

export async function GET(request: NextRequest) {
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
            throw Error("Login Fail");
        }

        const info = await res.json();

        let user = await prisma.user.findUnique({
            where: {
                email: info.email,
            },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: info.email,
                    name: info.name,
                    password: await hash(uuidv4()),
                },
            });
        }

        await login({ id: user.id }, request.headers.get("User-Agent")!);

        return Response.redirect(new URL("/profile"), 200);
    } catch (error) {
        return Response.redirect(new URL("/login"), 200);
    }
}
