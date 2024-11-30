import prisma from "@/database/prisma";
import { findOrCreateUserType } from "@/types";

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: { id },
        omit: {
            password: true,
            balance: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const findOrCreateUser = (data: findOrCreateUserType) => {
    return prisma.user.findOrCreate(data);
};

export const verifyUser = (email: string) => {
    return prisma.user.update({
        where: { email },
        data: { emailVerifiedAt: new Date() },
    });
};
