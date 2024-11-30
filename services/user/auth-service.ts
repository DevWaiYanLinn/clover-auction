import { session } from "@/lib/session";
import { HttpError } from "@/lib/exception";
import prisma from "@/database/prisma";

export const authenticatedUser = async () => {
    const auth = await session();
    const user =
        auth &&
        (await prisma.user.findUnique({
            where: {
                id: auth.user.id,
            },
            omit: {
                password: true,
                balance: true,
                createdAt: true,
                updatedAt: true,
            },
        }));
    if (!user) {
        throw new HttpError({
            status: 401,
            info: { message: "Not authorized" },
        });
    }
    return user;
};
