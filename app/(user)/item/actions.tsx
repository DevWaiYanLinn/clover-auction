"use server";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants";
import prisma from "@/database/prisma";
import { getServerSession } from "@/lib/session";
import ImageService from "@/services/image-service";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
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

export const getAllItem = async () => {
    const heads = await headers();
    const requestUrl = heads.get("referer") || "";
    const url = new URL(requestUrl);
    const where: { name?: string; subCategoryId?: number } = {};

    if (url.searchParams.has("name")) {
        where["name"] = url.searchParams.get("name")!;
    }

    if (url.searchParams.has("subcategory")) {
        where["subCategoryId"] = Number(url.searchParams.get("subCategoryId")!);
    }

    const session = await getServerSession();

    const items = await prisma.item.findMany({
        where: { userId: session!.user.id, ...where },
        orderBy: {
            id: "desc",
        },
        include: {
            auction: true,
            category: {
                select: {
                    name: true,
                },
            },
            subCategory: {
                select: {
                    name: true,
                },
            },
        },
    });

    return items;
};

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

            const session = await getServerSession();

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
            console.log(error);
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
        .number({ required_error: "Starting Price is required." })
        .int()
        .gt(0)
        .transform((price) => new Prisma.Decimal(price)),
    buyoutPrice: z
        .number({ required_error: "Buyout Price is required." })
        .int()
        .gt(0)
        .transform((price) => new Prisma.Decimal(price)),
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
    const startingPrice = Number(formData.get("startingPrice"));
    const buyoutPrice = Number(formData.get("buyoutPrice"));
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

    const session = await getServerSession();

    try {
        const item = await prisma.item.findFirst({
            where: {
                id,
                userId: session!.user.id,
            },
        });
        if (item) {
            await prisma.auction.create({
                data: { itemId: item.id, ...data },
            });
        }
    } catch (error) {
        return {
            errors: {
                ...prevState.errors,
                message: ["Auction Creating Failed"],
            },
        };
    }

    return redirect(backUrl);
};
