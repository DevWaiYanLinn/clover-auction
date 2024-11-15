"use server";
import { compare } from "@/lib/bcrypt";
import prisma from "@/database/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { login } from "@/lib/session";

const schema = z.object({
    email: z
        .string({ required_error: "Invalid Input." })
        .email("Invalid eamil format"),
    password: z.string({ required_error: "Invalid Input." }).min(1, "required"),
});

export async function singIn(
    prevState: {
        errors: {
            email?: string[];
            password?: string[];
        };
    },
    formData: FormData,
) {
    const email = formData.get("email");
    const password = formData.get("password");

    const validatedFields = await schema.spa({
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
        return { errors: { email: ["The password or email wrong!"] } };
    }

    await login({ id: user.id });

    redirect("/profile");
}
