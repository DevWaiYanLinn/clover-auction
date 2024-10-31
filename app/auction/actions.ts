import { prisma } from "@/lib/prisma";

export const getAllCategories = async () => {
    return prisma.category.findMany({
        include: {
            subcategories: true,
        },
    });
};
