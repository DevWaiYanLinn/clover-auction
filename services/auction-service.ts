import prisma from "@/database/prisma";
import { AuctionStatus } from "@prisma/client";

export const getAllAuctions = async ({
    subcategory,
    name,
    status,
}: {
    [key: string]: string | string[] | undefined;
} = {}) => {
    const filter: {
        item: { subCategoryId?: number; name?: string };
        status?: AuctionStatus;
    } = {
        item: {},
    };

    if (subcategory && typeof subcategory === "string") {
        filter.item["subCategoryId"] = Number(subcategory);
    }

    if (name && typeof name === "string") {
        filter.item["name"] = name;
    }

    if (Object.values(AuctionStatus).some((s) => s === status)) {
        filter["status"] = status as AuctionStatus;
    }

    return prisma.auction.findMany({
        include: {
            item: {
                include: {
                    seller: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                },
            },
        },
        where: filter,
        orderBy: {
            id: "desc",
        },
    });
};
