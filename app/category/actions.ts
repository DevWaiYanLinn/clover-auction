import prisma from "@/database/prisma";
import { cache } from "react";

export const getAllCategories = cache(async () => {
    return await prisma.category.findMany({
        include: {
            subcategories: true,
        },
    });
});
