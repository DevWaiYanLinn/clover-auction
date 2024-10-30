import { prisma } from "@/lib/prisma";

export const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        include: {
            subcategories: true,
        },
    });

    return categories;
};
