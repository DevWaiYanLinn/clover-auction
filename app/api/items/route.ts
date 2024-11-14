import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants";
import prisma from "@/database/prisma";
import { getSession } from "@/lib/session";
import { getAllItems } from "@/services/item-service";
import { type NextRequest } from "next/server";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import ImageService from "@/services/image-service";
import { HttpError } from "@/lib/exception";

const createSchema = z.object({
    name: z
        .string({
            required_error: "Invalid input.",
        })
        .min(1, "required."),
    subcategory: z
        .string({ required_error: "Invalid Input." })
        .regex(/^\d+$/, "Invalid Input.")
        .transform((d) => Number(d)),
    description: z
        .string({ required_error: "Invalid Input." })
        .min(1, "required."),
    photo: z
        .any()
        .refine((file: File) => file?.name !== "undefined", "File is required.")
        .refine(
            (file: File) => file?.size <= MAX_FILE_SIZE,
            "File size must be less than or equal 1MB.",
        )
        .refine(
            (file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png, .webp.",
        ),
});

export async function GET(request: NextRequest) {
    const items = await getAllItems();
    return Response.json(items, { status: 200 });
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const validatedFields = await createSchema.spa({
        name: formData.get("name"),
        subcategory: formData.get("subcategory"),
        description: formData.get("description"),
        photo: formData.get("photo"),
    });

    try {
        if (!validatedFields.success) {
            throw new HttpError({
                info: validatedFields.error.flatten().fieldErrors,
                status: 422,
            });
        }

        const data = validatedFields.data;

        const imageService = new ImageService();

        const result = await imageService.nextUploadStream(
            data.name,
            uuidv4(),
            data.photo,
        );

        if (!result) {
            throw new HttpError({
                status: 500,
                message: "Image uploading failed.",
            });
        }

        const subcategory = await prisma.subCategory.findUnique({
            where: { id: Number(data.subcategory) },
        });

        const session = await getSession();

        const item = await prisma.item.create({
            data: {
                categoryId: subcategory!.categoryId,
                name: data.name,
                description: data.description,
                imageUrl: result.secure_url,
                subCategoryId: subcategory!.id,
                userId: session!.user.id,
                publicImageId: result.public_id,
            },
        });
        return Response.json(item, { status: 200 });
    } catch (error: unknown) {
        const [data, init] =
            error instanceof HttpError
                ? [
                      { info: error.info, message: error.message },
                      { status: error.status },
                  ]
                : [{ info: {}, message: "unknown error" }, { status: 500 }];
        return Response.json(data, init);
    }
}
