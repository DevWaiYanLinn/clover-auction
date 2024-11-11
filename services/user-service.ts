import prisma from "@/database/prisma";

export const getAuthUser = async (id: number) => {
    return prisma.user.findUnique({
        where: { id },
        omit: {
            password: true,
            createdAt: true,
            updatedAt: true,
            balance: true,
        },
    });
};
