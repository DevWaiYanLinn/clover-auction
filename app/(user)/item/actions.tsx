"use server";

import prisma from "@/database/prisma";
import { getServerSession } from "@/lib/session";
import ImageService from "@/services/image-service";

import { z } from "zod";

const schema = z.object({
    name: z.string({ invalid_type_error: "Invalid name." }),
    subcategory: z.string({ invalid_type_error: "Invalid subcategory." }),
    description: z.string({ invalid_type_error: "Invalid subcategory." }),
});

export const getItemPageData = async () => {
    const categories = await prisma.category.findMany({
        include: {
            subcategories: true,
        },
    });

    const items = await prisma.item.findMany({
        include: {
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

    return { categories, items };
};

export const createItem = async (
    prevState: {
        errors: {
            subcategory?: string[];
            name?: string[];
            description?: string[];
            message?: string[];
        };
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
                    message: ["Item Creating Failed"],
                },
            };
        }
    }

    return prevState;
};
