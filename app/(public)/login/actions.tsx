"use server";
import { compare } from "@/lib/bcrypt";
import prisma from "@/database/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { login } from "@/lib/session";

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

    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user?.id || !(await compare(data.password, user.password))) {
        return { errors: { message: ["The name or email wrong!"] } };
    }

    await login({ id: user.id });

    redirect("/profile");
}
