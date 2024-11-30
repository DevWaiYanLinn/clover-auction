import prisma from "@/database/prisma";
import ImageService from "@/services/user/image-service";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "@/lib/exception";
import { createAuctionSchemaType } from "@/validation/auction-schema";
import { CreateItemSchemaType } from "@/validation/item-schema";
import { authenticatedUser } from "@/services/user/auth-service";

export const getAllItems = async (
    query: {
        [key: string]: string | string[] | undefined;
    } = {},
) => {
    const filter: { name?: string; subcategory?: number } = {};
    const user = await authenticatedUser();

    if (query["name"]) {
        filter["name"] = query["name"] as string;
    }

    if (query["subcategory"]) {
        filter["subcategory"] = Number(query["subcategory"]);
    }

    return prisma.item.findMany({
        where: { userId: user.id, ...filter },
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
};

export const createItem = async (data: CreateItemSchemaType) => {
    const user = await authenticatedUser();
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
        where: { id: data.subcategory },
    });

    return await prisma.item.create({
        data: {
            categoryId: subcategory!.categoryId,
            name: data.name,
            description: data.description,
            imageUrl: result.secure_url,
            subCategoryId: subcategory!.id,
            userId: user.id,
            publicImageId: result.public_id,
        },
    });
};

export const createAuctionByItemId = async (
    itemId: number,
    data: createAuctionSchemaType,
) => {
    const user = await authenticatedUser();

    const item = await prisma.item.findUnique({
        where: {
            id: itemId,
            userId: user.id,
        },
    });

    if (!item) {
        throw new HttpError({ status: 404 });
    }

    return await prisma.auction.create({
        data: { ...data, itemId: item.id },
    });
};
