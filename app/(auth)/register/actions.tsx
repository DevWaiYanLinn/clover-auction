"use server";
import { hash } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
    email: z
        .string({ invalid_type_error: "Invalid Email." })
        .email({ message: "Invalid Email." }),
    name: z
        .string({ invalid_type_error: "Invalid name." })
        .min(5, "Name must be a least minimum 5 characters."),
    password: z
        .string({ invalid_type_error: "Invalid name." })
        .min(8, "Password must be a least minimum 8 characters."),
});

export async function signUp(
    prevState: {
        errors: { name?: string[]; email?: string[]; password?: string[] };
    },
    formData: FormData,
) {
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    const validatedFields = schema.safeParse({
        name,
        email,
        password,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;

    const userExist = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (userExist?.id) {
        return {
            errors: {
                email: ["The email is already registered."],
            },
        };
    }

    data.password = await hash(data.password);

    try {
        const userRole = await prisma.role.findFirst({
            where: { name: "buyer/seller" },
        });

        await prisma.user.create({
            data: {
                ...data,
                emailVerifiedAt:
                    process.env.NODE_ENV === "production" ? null : new Date(),
                reputation: 3,
                balance: 0,
                roles: {
                    create: [{ roleId: userRole!.id }],
                },
            },
        });
    } catch (error) {
        console.log(error);
    }

    redirect("/login");
}
