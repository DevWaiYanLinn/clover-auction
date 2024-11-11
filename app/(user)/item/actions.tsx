"use server";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants";
import prisma from "@/database/prisma";
import { getSession } from "@/lib/session";
import ImageService from "@/services/image-service";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
    name: z
        .string({
            invalid_type_error: "Invalid name.",
        })
        .min(1, "Name is required."),
    subcategory: z
        .string({ invalid_type_error: "Invalid subcategory." })
        .min(1, "Subcategory is required."),
    description: z
        .string({ invalid_type_error: "Invalid subcategory." })
        .min(1, "Description is required."),
    photo: z
        .any()
        .refine((file: File) => file?.name !== "undefined", "File is required.")
        .refine(
            (file: File) => file?.size <= MAX_FILE_SIZE,
            "File size must be greater than or equal 1MB.",
        )
        .refine(
            (file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png, .webp.",
        ),
});

export const createItem = async (
    prevState: {
        errors?: {
            subcategory?: string[];
            name?: string[];
            description?: string[];
            message?: string[];
            photo?: string[];
        };
        success?: boolean;
    },
    formData: FormData,
) => {
    const file = formData.get("photo") as File;
    const name = formData.get("name");
    const subcategory = formData.get("subcategory");
    const description = formData.get("description");
    const validatedFields = schema.safeParse({
        name,
        subcategory,
        description,
        photo: file,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;

    if (file) {
        const imageService = new ImageService();

        try {
            const result = await imageService.nextUploadStream(
                data.name,
                data.subcategory,
                file,
            );

            if (!result) {
                throw new Error("Image upload error");
            }

            const subcategory = await prisma.subCategory.findUnique({
                where: { id: Number(data.subcategory) },
            });

            const session = await getSession();

            await prisma.item.create({
                data: {
                    categoryId: subcategory!.categoryId,
                    name: data.name,
                    description: data.description,
                    imageUrl: result.secure_url,
                    subCategoryId: subcategory!.id,
                    userId: session!.user.id,
                },
            });
        } catch (error) {
            return {
                errors: {
                    name: [],
                    subcategory: [],
                    description: [],
                    photo: [],
                    message: ["Item Creating Failed"],
                },
            };
        }
    }

    return redirect("/item");
};

const itemAuctionSchema = z.object({
    startTime: z
        .string({ required_error: "Start Date is required." })
        .pipe(z.coerce.date())
        .transform((date) => new Date(date)),
    endTime: z
        .string({ required_error: "Start Date is required." })
        .pipe(z.coerce.date())
        .transform((date) => new Date(date)),
    startingPrice: z
        .string({ required_error: "Invalid Input" })
        .regex(/^\d+(\.\d+)?$/, "Invalid Input")
        .transform(Number),
    buyoutPrice: z
        .string({ required_error: "Invalid Input" })
        .regex(/^\d+(\.\d+)?$/, "Invalid Input")
        .transform(Number),
    description: z.string().nullable(),
});

export const itemAuction = async (
    id: number,
    backUrl: string,
    prevState: {
        errors?: {
            startingPrice?: string[];
            buyoutPrice?: string[];
            description?: string[];
            startTime?: string[];
            endTime?: string[];
            message?: string[];
        };
        success?: boolean;
    },
    formData: FormData,
) => {
    const startingPrice = formData.get("startingPrice");
    const buyoutPrice = formData.get("buyoutPrice");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const description = formData.get("description");

    const validatedFields = itemAuctionSchema.safeParse({
        startingPrice,
        buyoutPrice,
        startTime,
        endTime,
        description,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;

    try {
        const session = await getSession();

        if (!session) {
            throw new Error("Session Expired!");
        }

        const item = await prisma.item.findFirstOrThrow({
            where: {
                id,
                userId: session.user.id,
            },
        });

        await prisma.auction.create({
            data: { itemId: item.id, ...data },
        });
    } catch (error: unknown) {
        return {
            errors: {
                success: false,
                message:
                    error instanceof Error
                        ? [error.message]
                        : ["Auction Creating Failed"],
            },
        };
    }

    return redirect("/item");
};
