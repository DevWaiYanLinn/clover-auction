"use server";
import { compare } from "@/lib/bcrypt";
import prisma from "@/database/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
import config from "@/config";

const schema = z.object({
    email: z.string({ invalid_type_error: "Invalid Email." }),
    password: z.string({ invalid_type_error: "Invalid name." }),
});

export async function singIn(
    prevState: {
        errors: {
            email?: string[] | undefined;
            password?: string[] | undefined;
            message?: string[] | undefined;
        };
    },
    formData: FormData,
) {
    const email = formData.get("email");
    const password = formData.get("password");

    const validatedFields = schema.safeParse({
        email,
        password,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;

    const user = await prisma.user.findFirst({ where: { email: data.email } });

    console.log(user);

    if (!user?.id || !(await compare(data.password, user.password))) {
        return { errors: { message: ["The name or email wrong!"] } };
    }
    const cookieStore = await cookies();

    const encryptedString = await encrypt({
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        reputation: user.reputation,
    });

    cookieStore.set(config.session.cookieName, encryptedString, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        secure: process.env.NODE_ENV === "production",
    });

    revalidatePath("/", "layout");
    revalidateTag("1");

    redirect("/auction?tag=1");
}
