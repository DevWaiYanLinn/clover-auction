import prisma from "@/database/prisma";
import { getSession } from "@/lib/session";

export const getAllItem = async (
    filters: {
        [key: string]: string | string[] | undefined;
    } = {},
) => {
    const where: { name?: string; subCategoryId?: number } = {};

    const session = await getSession();

    if (filters["name"]) {
        where["name"] = filters["name"] as string;
    }

    if (filters["subCategoryId"]) {
        where["subCategoryId"] = Number(filters["subCategoryId"]);
    }

    return prisma.item.findMany({
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
};
