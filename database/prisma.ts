import { hash } from "@/lib/bcrypt";
import { getAuctionStatus } from "@/lib/utils";
import { findOrCreateUserType } from "@/types";
import { AuctionStatus, PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    const prisma = new PrismaClient();
    return prisma.$extends({
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
                    needs: { startTime: true, endTime: true, buyout: true },
                    compute(auction) {
                        return getAuctionStatus(
                            auction.startTime,
                            auction.endTime,
                            auction.buyout,
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
