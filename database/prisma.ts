import { hash } from "@/lib/bcrypt";
import { getAuctionStatus } from "@/lib/utils";
import { findOrCreateUserType } from "@/types";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    const prisma = new PrismaClient();
    return prisma.$extends({
        name: "extend-client-1",
        model: {
            user: {
                async findOrCreate({ email, data }: findOrCreateUserType) {
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user) {
                        return prisma.user.create({
                            data: {
                                ...data,
                                password: await hash(data.password),
                            },
                        });
                    }
                    return user;
                },
            },
        },
        result: {
            auction: {
                status: {
                    needs: { startTime: true, endTime: true, userId: true },
                    compute(auction) {
                        return getAuctionStatus(
                            auction.startTime,
                            auction.endTime,
                            auction.userId,
                        );
                    },
                },
            },
        },
    });
};

type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>;

declare const globalThis: {
    prismaGlobal: ExtendedPrismaClient;
} & typeof global;

const prisma: ExtendedPrismaClient =
    globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
