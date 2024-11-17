import prisma from "@/database/prisma";
import { auth } from "@/lib/session";

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
