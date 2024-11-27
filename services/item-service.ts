import prisma from "@/database/prisma";
import { auth } from "@/lib/session";
import ImageService from "@/services/image-service";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "@/lib/exception";
import { createAuctionSchemaType } from "@/validation/auction-schema";
import { CreateItemSchemaType } from "@/validation/item-schema";

export const getAllItems = async (
    query: {
        [key: string]: string | string[] | undefined;
    } = {},
) => {
    const filter: { name?: string; subcategory?: number } = {};

    const session = await auth();

    if (query["name"]) {
        filter["name"] = query["name"] as string;
    }

    if (query["subcategory"]) {
        filter["subcategory"] = Number(query["subcategory"]);
    }

    return prisma.item.findMany({
        where: { userId: session?.user.id, ...filter },
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

    const session = await auth();

    return await prisma.item.create({
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
};

export const createAuctionByItemId = async (
    id: number,
    data: createAuctionSchemaType,
) => {
    const item = await prisma.item.findUnique({
        where: {
            id,
        },
    });

    if (!item) {
        throw new HttpError({ status: 404 });
    }

    const auction = await prisma.auction.create({
        data: { ...data, itemId: item.id },
    });

    return Response.json(auction, { status: 200 });
};
