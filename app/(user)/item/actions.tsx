"use server";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants";
import prisma from "@/database/prisma";
import { getServerSession } from "@/lib/session";
import ImageService from "@/services/image-service";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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
            "File size must be greater than or equal 5MB.",
        )
        .refine(
            (file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png, .webp.",
        ),
});

export const getAllItem = async () => {
    const heads = await headers();
    const requestUrl = (await heads.get("referer")) || "";
    const url = new URL(requestUrl);
    const where: { name?: string; subcategory?: number } = {};

    if (url.searchParams.has("name")) {
        where["name"] = url.searchParams.get("name")!;
    }

    if (url.searchParams.has("subcategory")) {
        where["subcategory"] = Number(url.searchParams.get("subcategory")!);
    }

    const items = await prisma.item.findMany({
        where,
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

    revalidatePath("/item");
    return { success: true, errors: {} };
};
