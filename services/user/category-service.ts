import prisma from "@/database/prisma";

export const getAllCategories = async () => {
    return prisma.category.findMany({
        include: {
            subcategories: true,
        },
    });
};
