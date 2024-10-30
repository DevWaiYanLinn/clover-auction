"use server";
import { compare } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";

const schema = z.object({
    email: z.string({ invalid_type_error: "Invalid Email." }),
    password: z.string({ invalid_type_error: "Invalid name." }),
});

export default async function singIn(
    prevState: {
        errors: {
            email?: string[];
            password?: string[];
            message?: string[];
        };
    },
    formData: FormData,
) {
    const name = formData.get("name");
    const email = formData.get("email");

    const validatedFields = schema.safeParse({
        name,
        email,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;

    const user = await prisma.user.findFirst({ where: { email: data.email } });

    if (!user?.id || !(await compare(data.password, user.password))) {
        return { errors: { message: ["The name or email wrong!"] } };
    }
    const cookieStore = await cookies();

    const encryptedString = encrypt({
        name: user.name,
        email: user.email,
        balance: user.balance,
        reputation: user.reputation,
    });

    cookieStore.set("clover-auction-house", encryptedString, {
        path: "/",
        httpOnly: true, // Set to true if you want to prevent client-side access
        maxAge: 60 * 60 * 24 * 365, // Cookie expiration time in seconds (1 day)
        secure: process.env.NODE_ENV === "production",
    });

    redirect("/auction");
}
