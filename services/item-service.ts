import prisma from "@/database/prisma";
import { getSession } from "@/lib/session";

export const getAllItems = async (
    filters: {
        [key: string]: string | string[] | undefined;
    } = {},
) => {
    const where: { name?: string; subcategory?: number } = {};

    const session = await getSession();

    if (filters["name"]) {
        where["name"] = filters["name"] as string;
    }

    if (filters["subcategory"]) {
        where["subcategory"] = Number(filters["subcategory"]);
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
